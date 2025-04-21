using Common.Logging;
using Scrutor;

namespace Configuracion.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLogging(configuration);

        services.AddHttpContextAccessor();

        services.AddDbContextPool<ConfigContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });



        // Services that should be scoped (have dependencies on ConfigContext)
        string[] scopedNamespaces =
        [
            "Configuracion.API.Endpoints.Implementations",
            "Configuracion.Application.Services",
            "Configuracion.Application.Services.Printing",
            "Configuracion.Application.Services.Sri",
            "Configuracion.Application.Services.WizardConfig"
        ];

        // Register scoped services
        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNamespaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        // Other services that can be transient
        string[] transientNamespaces =
        [
            "Common.Infrastructure.Data.Repository.Implementations",
            "Common.Services.Extensions"
        ];

        // Register transient services
        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(transientNamespaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime());

        return services;
    }
}
