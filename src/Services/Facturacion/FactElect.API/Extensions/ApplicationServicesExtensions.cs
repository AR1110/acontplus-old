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
            "Common.FactElect.Services"
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
