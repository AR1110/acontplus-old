using Acontplus.FactElect.Interfaces.Services;
using Acontplus.FactElect.Services.Conversion;
using Acontplus.FactElect.Services.Documents;
using Acontplus.FactElect.Services.External;
using Acontplus.Utilities.Time;
using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;
using System.Text.Json.Serialization;

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
        services.AddControllers();

        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new NullableDateTimeConverter());
            options.SerializerOptions.PropertyNameCaseInsensitive = true;
            options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
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
