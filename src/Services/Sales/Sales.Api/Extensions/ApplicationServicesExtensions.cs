using Acontplus.Services.Extensions.Authentication;
using Scrutor;

namespace Sales.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddVentasServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        services.AddControllers();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        string[] nameSpaces =
        [
            "Acontplus.Persistence.SqlServer.Repositories",
            "Sales.Application.Services",
            "Acontplus.Services.Extensions.Context"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(nameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );

        return services;
    }
}
