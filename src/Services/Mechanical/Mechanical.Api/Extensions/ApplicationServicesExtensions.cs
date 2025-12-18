using Acontplus.Persistence.SqlServer.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Scrutor;

namespace Mechanical.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddMechanicalServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        services.AddControllers();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddSqlServerPersistence<MechanicalContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddCachingServices(configuration);

        string[] scopedNameSpaces =
        [
            "Mechanical.Infrastructure.Persistence.Repositiories",
        "Mechanical.Application.Services",
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

        return services;
    }
}
