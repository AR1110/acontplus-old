using System.IO.Compression;
using System.Text.Json.Serialization;
using Common.FactElect.Services.Authentication;
using Common.FactElect.Services.Conversion;
using Common.FactElect.Services.External;
using Common.FactElect.Services.Validation;
using FactElect.Application;
using FactElect.Application.Services;
using FactElect.Application.Services.Sri;
using FactElect.Infrastructure.Persistence;
using Microsoft.AspNetCore.ResponseCompression;
using Scrutor;

namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddHttpContextAccessor();

        services.AddHostedService<DocumentoElectronicoErrorCleanupBackgroundService>();

        services.AddMemoryCache();

        // Program.cs
        services.AddSriAuthentication(options =>
        {
            configuration.GetSection("SriAuthentication").Bind(options);
        });
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
            "Common.Infrastructure.Repository.Implementations",
            "Common.Services.Extensions",
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
