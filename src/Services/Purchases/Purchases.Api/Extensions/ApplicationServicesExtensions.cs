using Acontplus.Services.Extensions.Authentication;
using Scrutor;

namespace Purchases.Api.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddComprasServices(this IServiceCollection services,
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

    services.AddDbContextPool<PurchasesContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

    string[] scopedNameSpaces =
    [
        "Purchases.Application.Services",
            "Purchases.Infrastructure.Persistence.Repositories",
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

    services.AddTransient<IWebServiceSri, WebServiceSri>();
    services.AddTransient<IXmlSriFileService, XmlSriFileService>();
    services.AddSingleton<IDocumentConverter, DocumentConverter>();

    return services;
  }
}
