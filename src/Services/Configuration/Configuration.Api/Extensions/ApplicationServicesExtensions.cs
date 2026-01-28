using Acontplus.Persistence.SqlServer.DependencyInjection;
using Acontplus.Services.Extensions.Authentication;
using Configuration.Infrastructure.Extensions;
using Scrutor;

namespace Configuration.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddConfigurationServices(this IServiceCollection services,
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

        services.AddConfigurationInfrastructure(configuration);

        services.AddCachingServices(configuration);

        // During EF Core design-time (migrations), skip scanning app services
        // to avoid validating services that depend on runtime-only integrations.
        var isDesignTime = string.Equals(Environment.GetEnvironmentVariable("EF_DESIGN_TIME"), "1", StringComparison.OrdinalIgnoreCase);
        if (!isDesignTime)
        {
            // Services that should be scoped (have dependencies on ConfigContext)
            string[] scopedNamespaces =
            [
                "Configuration.Application.Services",
                "Configuration.Application.Services.Printing",
                "Configuration.Application.Services.Sri",
                "Configuration.Application.Services.WizardConfig",
                "Configuration.Infrastructure.Persistence.Repositories",
                "Acontplus.Persistence.SqlServer.Repositories",
                "Acontplus.Services.Extensions.Context",
                "Acontplus.Services.Services.Implementations",
                "Acontplus.Utilities.Security.Services"
            ];

            // Register scoped services
            services.Scan(scan => scan
                .FromApplicationDependencies()
                .AddClasses(classes => classes.InNamespaces(scopedNamespaces))
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsImplementedInterfaces()
                .WithScopedLifetime());
        }

        services.AddLookupService();

        return services;
    }
}
