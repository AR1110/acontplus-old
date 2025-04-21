using Common.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Scrutor;
using Serilog;

namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddAdvancedLogging(configuration);

        services.AddHttpContextAccessor();

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
            options.SerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        });
        services.Configure<JsonOptions>(options =>
        {
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            options.JsonSerializerOptions.Converters.Add(new NullableDateTimeConverter());
        });

        services.AddDbContextPool<FactElectContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("FactElect.Infrastructure")) //Migrations in infrastructure library
            .EnableSensitiveDataLogging(environment.IsDevelopment()) // Enable only in Development
            .EnableDetailedErrors(environment.IsDevelopment())
            .LogTo(Log.Warning, LogLevel.Warning) // Log EF Core queries using Serilog
);

        string[] scopedNameSpaces =
        [
            "FactElect.Application.Services",
            "FactElect.Application.Services.Logistica",
            "FactElect.Application.Services.RetencionAts",
            "FactElect.Application.Services.Sri",
            "Common.FactElect.Services",
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
            "Common.Infrastructure.Data.Repository.Implementations",
            "Common.Services.Extensions"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(transientNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );

        return services;
    }
}
