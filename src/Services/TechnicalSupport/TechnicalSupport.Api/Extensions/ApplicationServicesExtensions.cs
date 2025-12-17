using Acontplus.Persistence.SqlServer.DependencyInjection;
using Acontplus.Services.Extensions.Authentication;
using Scrutor;

namespace TechnicalSupport.Api.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddTechnicalSupportServices(this IServiceCollection services,
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

    services.AddSqlServerPersistence<TechnicalSupportContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

    services.AddCachingServices(configuration);

    string[] scopedNameSpaces =
    [
        "TechnicalSupport.Infrastructure.Persistence.Repositories",
        "TechnicalSupport.Application.Services",
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
