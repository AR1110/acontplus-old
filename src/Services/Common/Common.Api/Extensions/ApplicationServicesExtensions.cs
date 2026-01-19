using Acontplus.Infrastructure.Extensions;
using Acontplus.Persistence.SqlServer.DependencyInjection;
using Acontplus.Services.Configuration;
using Acontplus.Services.Extensions;
using Acontplus.Services.Extensions.Authentication;
using Common.Infrastructure.Extensions;
using Common.Infrastructure.Persistence;
using Scrutor;

namespace Common.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddCommonApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddCommonInfrastructure(configuration);

        services.AddCachingServices(configuration);

        string[] scopedNameSpaces =
        [
            "Common.Application.Services",
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
