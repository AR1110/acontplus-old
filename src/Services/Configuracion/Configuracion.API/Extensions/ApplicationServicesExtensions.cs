using Acontplus.Services.Extensions.Authentication;
using Acontplus.Utilities.Time;
using Scrutor;
using System.Text.Json.Serialization;

namespace Configuracion.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddConfigurationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAcontplusServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        services.AddControllers();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<ConfigContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("Configuracion.Infrastructure"));
        });

        // Services that should be scoped (have dependencies on ConfigContext)
        string[] scopedNamespaces =
        [
            "Configuracion.Application.Services",
            "Configuracion.Application.Services.Printing",
            "Configuracion.Application.Services.Sri",
            "Configuracion.Application.Services.WizardConfig",
            "Configuracion.Infrastructure.Persistence.Repositories",
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions"
        ];

        // Register scoped services
        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNamespaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        return services;
    }
}
