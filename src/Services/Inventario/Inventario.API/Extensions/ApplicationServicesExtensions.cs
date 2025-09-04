using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;

namespace Inventario.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddInventoryServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });
        services.AddDbContextPool<InventarioContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] scopedNameSpaces =
        [
            "Inventario.Application.Services",
            "Inventario.Infrastructure.Repositories",
            "Common.S3Application.Services",
            "Common.Infrastructure.Repository.Implementations"
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
