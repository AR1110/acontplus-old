using Acontplus.Persistence.SqlServer.DependencyInjection;
using Acontplus.Services.Extensions.Authentication;
using Scrutor;
using Vet.Infrastructure.Persistence;

namespace Vet.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddVetServices(this IServiceCollection services,
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

        services.AddSqlServerPersistence<VetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddCachingServices(configuration);

        string[] scopedNameSpaces =
        [
            "Vet.Infrastructure.Persistence.Repositories",
        "Vet.Application.Services",
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
