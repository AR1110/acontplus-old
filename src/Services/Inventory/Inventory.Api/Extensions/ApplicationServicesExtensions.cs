using Acontplus.Persistence.SqlServer.DependencyInjection;
using Acontplus.Services.Extensions.Authentication;
using Scrutor;

namespace Inventory.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddInventoryServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddSqlServerPersistence<InventoryContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddCachingServices(configuration);

        string[] scopedNameSpaces =
        [
            "Inventory.Application.Services",
            "Inventory.Infrastructure.Repositories",
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
