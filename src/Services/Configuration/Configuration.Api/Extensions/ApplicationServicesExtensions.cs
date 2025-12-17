using Acontplus.Persistence.SqlServer.DependencyInjection;
using Acontplus.Services.Extensions.Authentication;
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

    services.AddSqlServerPersistence<ConfigurationContext>(opt =>
    {
      opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
              x => x.MigrationsAssembly("Configuration.Infrastructure"));
    });

    services.AddCachingServices(configuration);

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
            "Acontplus.Services.Services.Implementations"
    ];

    // Register scoped services
    services.Scan(scan => scan
        .FromApplicationDependencies()
        .AddClasses(classes => classes.InNamespaces(scopedNamespaces))
        .UsingRegistrationStrategy(RegistrationStrategy.Skip)
        .AsImplementedInterfaces()
        .WithScopedLifetime());

    return services;
  }
}
