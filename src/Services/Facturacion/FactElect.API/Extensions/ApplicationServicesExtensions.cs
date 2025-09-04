using Acontplus.FactElect.Services.Authentication;
using Acontplus.FactElect.Services.Conversion;
using Acontplus.FactElect.Services.External;
using Acontplus.FactElect.Services.Validation;
using Acontplus.Utilities.Time;
using FactElect.Application.Services.Sri;
using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;
using System.IO.Compression;
using System.Text.Json.Serialization;

namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddBillingServices(this IServiceCollection services,
        IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddHttpContextAccessor();

        services.AddHostedService<DocumentoElectronicoErrorCleanupBackgroundService>();

        services.AddMemoryCache();

        services.AddHttpClient();
        services.AddSingleton<SriAuthenticationOptions>(new SriAuthenticationOptions());
        services.AddTransient<ISriAuthenticationService, SriAuthenticationService>();

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
        services.Configure<JsonOptions>(options =>
        {
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            options.JsonSerializerOptions.Converters.Add(new NullableDateTimeConverter());
        });

        services.AddDbContextPool<FactElectContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                        x => x.MigrationsAssembly("FactElect.Infrastructure"))); //Migrations in infrastructure library


        string[] scopedNameSpaces =
        [
            "FactElect.Application.Services",
            "FactElect.Application.Services.Logistica",
            "FactElect.Application.Services.RetencionAts",
            "FactElect.Application.Services.Sri",
            "FactElect.API.Endpoints.Implementations"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );

        string[] transientNameSpaces =
        [
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions",
            "FactElect.Infrastructure.Persistence.Repositories"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(transientNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );
        services.AddSingleton<IDocumentConverter, DocumentConverter>();
        services.AddScoped<ICookieService, CookieService>();
        services.AddScoped<ICaptchaService, CaptchaService>();
        services.AddScoped<IRucService, RucService>();
        services.AddScoped<ICedulaService, CedulaService>();
        return services;
    }
}
