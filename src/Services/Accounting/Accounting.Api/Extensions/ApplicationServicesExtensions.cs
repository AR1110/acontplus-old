using Acontplus.Persistence.SqlServer.DependencyInjection;
using Scrutor;

namespace Accounting.Api.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddAccountingServices(this IServiceCollection services,
      IConfiguration configuration)
  {
    services.AddApplicationServices(configuration);

    services.AddAdvancedLoggingOptions(configuration);

    services.AddJwtAuthentication(configuration);

    services.AddOpenApi();

    services.AddHttpContextAccessor();

    services.AddControllers();

    services.AddResponseCompression();

    JsonConfigurationService.ConfigureAspNetCore(services, false);

    JsonConfigurationService.RegisterJsonConfiguration(services);

    services.AddSqlServerPersistence<AccountingContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

    services.AddCachingServices(configuration);
    string[] scopedNameSpaces =
    [
        "Accounting.Infrastructure.Persistence.Repositories",
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
