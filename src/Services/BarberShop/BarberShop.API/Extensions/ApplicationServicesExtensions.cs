using Scrutor;
using System.IO.Compression;

namespace BarberShop.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddBarberShopServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddDbContextPool<BarberShopContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("BarberShop.Infrastructure"));
        });

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.AddHttpContextAccessor();

        services.AddOpenApi();

        string[] scopedNameSpaces =
        [
            "BarberShop.API.Endpoints.Implementations",
            "BarberShop.Application.Seats.Services",
            "BarberShop.Application.Tickets.Services",
            "BarberShop.Application.WorkSessions.Services",
            "BarberShop.Application.Services"
        ];
        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );

        string[] trascientNameSpaces =
        [
            "Acontplus.Persistence.SqlServer.Repositories",
            "BarberShop.Infrastructure.Persistence.Repositories",
            "Acontplus.Services.Extensions"
        ];
        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(trascientNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );

        return services;
    }
}
