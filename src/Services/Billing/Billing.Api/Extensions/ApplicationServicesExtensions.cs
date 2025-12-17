using Acontplus.Persistence.SqlServer.DependencyInjection;
using Scrutor;

namespace Billing.Api.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddBillingServices(this IServiceCollection services,
      IConfiguration configuration, IWebHostEnvironment environment)
  {
    services.AddApplicationServices(configuration);

    services.AddAdvancedLoggingOptions(configuration);

    services.AddJwtAuthentication(configuration);

    services.AddOpenApi();

    services.AddHttpContextAccessor();

    services.AddControllers();

    JsonConfigurationService.ConfigureAspNetCore(services, false);

    JsonConfigurationService.RegisterJsonConfiguration(services);

    services.AddHostedService<DocumentoElectronicoErrorCleanupBackgroundService>();

    services.AddMemoryCache();

    services.AddHttpClient();

    services.AddSqlServerPersistence<BillingContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    x => x.MigrationsAssembly("Billing.Infrastructure"))); //Migrations in infrastructure library

    services.AddCachingServices(configuration);
    string[] scopedNameSpaces =
    [
        "Billing.Application.Services",
            "Billing.Application.Services.Logistica",
            "Billing.Application.Services.RetencionAts",
            "Billing.Application.Services.Sri",
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions.Context",
            "Billing.Infrastructure.Persistence.Repositories",
            "Acontplus.Services.Services.Implementations"
    ];

    services.Scan(scan => scan
        .FromApplicationDependencies()
        .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
        .UsingRegistrationStrategy(RegistrationStrategy.Skip)
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    );

    services.AddSingleton<IDocumentConverter, DocumentConverter>();
    services.AddScoped<ICookieService, CookieService>();
    services.AddScoped<ICaptchaService, CaptchaService>();
    services.AddScoped<IRucService, RucService>();
    services.AddScoped<ICedulaService, CedulaService>();

    services.AddSingleton<SriAuthenticationOptions>(new SriAuthenticationOptions());
    services.AddTransient<ISriAuthenticationService, SriAuthenticationService>();

    return services;
  }
}
