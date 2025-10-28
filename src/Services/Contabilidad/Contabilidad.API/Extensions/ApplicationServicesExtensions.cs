using Acontplus.Utilities.Time;
using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;
using System.Text.Json.Serialization;

namespace Contabilidad.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddAccountingServices(this IServiceCollection services,
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

        services.AddDbContextPool<ContabilidadContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


        string[] scopedNameSpaces =
        [
            "Contabilidad.Infrastructure.Persistence.Repositories",
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );
        return services;
    }
}
