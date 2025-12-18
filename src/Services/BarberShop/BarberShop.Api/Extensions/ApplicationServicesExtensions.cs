using Acontplus.Persistence.SqlServer.DependencyInjection;
using Scrutor;

namespace BarberShop.Api.Extensions;

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

        services.AddSqlServerPersistence<BarberShopContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("BarberShop.Infrastructure"));
        });

        services.AddCachingServices(configuration);

        string[] scopedNameSpaces =
        [
            "BarberShop.Application.Seats.Services",
            "BarberShop.Application.Tickets.Services",
            "BarberShop.Application.WorkSessions.Services",
            "BarberShop.Application.Services",
            "Acontplus.Persistence.SqlServer.Repositories",
            "BarberShop.Infrastructure.Persistence.Repositories",
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

        return services;
    }
}
