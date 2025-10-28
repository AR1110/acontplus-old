using Acontplus.FactElect.Services.Authentication;
using Acontplus.FactElect.Services.Conversion;
using Acontplus.FactElect.Services.External;
using Acontplus.FactElect.Services.Validation;
using Acontplus.Services.Extensions.Authentication;
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
        services.AddAcontplusServices(configuration);

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

        services.AddDbContextPool<FactElectContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                        x => x.MigrationsAssembly("FactElect.Infrastructure"))); //Migrations in infrastructure library


        string[] scopedNameSpaces =
        [
            "FactElect.Application.Services",
            "FactElect.Application.Services.Logistica",
            "FactElect.Application.Services.RetencionAts",
            "FactElect.Application.Services.Sri",
            "FactElect.API.Endpoints.Implementations",
            "Acontplus.Persistence.SqlServer.Repositories",
            "Acontplus.Services.Extensions",
            "FactElect.Infrastructure.Persistence.Repositories"
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
