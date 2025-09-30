using Acontplus.S3Application.Models;
using Acontplus.Services.Extensions.Authentication;
using Scrutor;

namespace Restaurant.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddRestaurantServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAcontplusServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<RestaurantContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("Restaurant.Infrastructure"));
        });

        string[] scopedNameSpaces =
        [
            "Restaurant.Application.Services",
            "Restaurant.Infrastructure.Persistence.Repositories",
            "Common.S3Application.Services",
            "Acontplus.Persistence.SqlServer.Repositories"
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
