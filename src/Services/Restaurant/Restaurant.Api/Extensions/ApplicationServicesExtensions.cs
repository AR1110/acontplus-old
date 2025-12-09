using Acontplus.Infrastructure.Extensions;
using Acontplus.S3Application.Models;
using Acontplus.Services.Extensions.Authentication;
using Restaurant.Application.BackgroundServices;
using Restaurant.Application.Infrastructure;
using Restaurant.Application.Mapping;
using Restaurant.Domain.Events;
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

        services.AddResponseCompression();

        services.AddResponseCompression();

        // Register Application Mappings -> Mapster

    services.RegisterMappings();

    JsonConfigurationService.ConfigureAspNetCore(services, false);

        //services.AddLookupService();

        //services.AddLookupService();

        services.AddInfrastructure(configuration);

        // Add Caching Services
        services.AddCachingServices(configuration);

        string[] scopedNameSpaces =
        [
            "Restaurant.Application.Services",
            "Restaurant.Application.Services.MealManagement",
            "Restaurant.Infrastructure.Persistence.Repositories",
            "Acontplus.S3Application.Services",
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions.Context",
            "Acontplus.Services.Services.Implementations"
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
