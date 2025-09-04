using Common.Infrastructure.Persistence;
using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;

namespace Common.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddCommonApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddHttpContextAccessor();

        services.AddDbContextPool<CommonContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        services.AddOpenApi();

        string[] scopedNameSpaces =
        [
            "Common.Application.Services",
            "Common.Infrastructure.Repository.Implementations",
            "Common.Services.Extensions"
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
