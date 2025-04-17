using Scrutor;

namespace BarberShop.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {
        services.AddOpenApi();

        services.AddDbContextPool<BarberShopContext>(opt =>
        {
            opt.UseSqlServer(config.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("BarberShop.Infrastructure"));
        });

        string[] scopedNameSpaces = [
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
            "Common.Infrastructure.Data.Repository.Implementations"
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
