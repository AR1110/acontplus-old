using Scrutor;

namespace BarberShop.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddBarberShopServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<BarberShopContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("BarberShop.Infrastructure"));
        });

        string[] scopedNameSpaces =
        [
            "BarberShop.API.Endpoints.Implementations",
            "BarberShop.Application.Seats.Services",
            "BarberShop.Application.Tickets.Services",
            "BarberShop.Application.WorkSessions.Services",
            "BarberShop.Application.Services",
            "Acontplus.Persistence.SqlServer.Repositories",
            "BarberShop.Infrastructure.Persistence.Repositories",

            "Acontplus.Services.Extensions.Context"
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
