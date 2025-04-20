using Common.Logging;
using Scrutor;

namespace BarberShop.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLogging(configuration);

        services.AddDbContextPool<BarberShopContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("BarberShop.Infrastructure"));
        });

        services.AddHttpContextAccessor();

        services.AddOpenApi();

        string[] scopedNameSpaces = [
            "BarberShop.API.Endpoints.Implementations",
            "BarberShop.Application.Services"
        ];
        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );

        string[] trascientNameSpaces = [
            "Common.Infrastructure.Data.Repository.Implementations",
             "Common.Services.Extensions"
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
