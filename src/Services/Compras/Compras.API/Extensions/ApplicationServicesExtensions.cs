using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;
using Acontplus.FactElect.Interfaces.Services;
using Acontplus.FactElect.Services.Conversion;
using Acontplus.FactElect.Services.Documents;
using Acontplus.FactElect.Services.External;

namespace Compras.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddComprasServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });
        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });
        services.AddDbContextPool<ComprasContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] scopedNameSpaces =
        [
            "Compras.Application.Services",
            "Compras.Infrastructure.Persistence.Repositories",
            "Common.Infrastructure.Repository.Implementations"
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
