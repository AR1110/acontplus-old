using Acontplus.Services.Extensions.Authentication;
using Acontplus.Utilities.Time;
using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;
using System.Text.Json.Serialization;

namespace Inventario.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddInventoryServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAcontplusServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<InventarioContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] scopedNameSpaces =
        [
            "Inventario.Application.Services",
            "Inventario.Infrastructure.Repositories",
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
