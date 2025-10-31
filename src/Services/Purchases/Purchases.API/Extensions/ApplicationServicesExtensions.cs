using Acontplus.FactElect.Interfaces.Services;
using Acontplus.FactElect.Services.Conversion;
using Acontplus.FactElect.Services.Documents;
using Acontplus.FactElect.Services.External;
using Acontplus.Services.Extensions.Authentication;
using Scrutor;

namespace Purchases.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddComprasServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAcontplusServices(configuration);

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
            "Acontplus.Persistence.SqlServer.Repositories"
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
