using Acontplus.S3Application.Models;
using Acontplus.Services.Extensions.Authentication;
using Restaurant.Application.Mapping;
using Restaurant.Infrastructure.Extensions;
using Scrutor;

namespace Restaurant.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddRestaurantServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        // Register Application Mappings -> Mapster

        services.RegisterMappings();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        services.AddInfrastructure(configuration);

        string[] scopedNameSpaces =
        [
            "Restaurant.Application.Services",
            "Restaurant.Application.Services.MealManagement",
            "Restaurant.Infrastructure.Persistence.Repositories",
            "Acontplus.S3Application.Services",
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions.Context"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );

        services.AddTransient<S3ObjectCustom>();
        return services;
    }
}
