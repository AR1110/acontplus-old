using Common.Logging;
using Scrutor;

namespace Inventario.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLogging(configuration);

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });
        services.AddDbContextPool<InventarioContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] nameSpaces =
        [
            "Common.Infrastructure.Repository.Implementations",
            "Common.S3Application.Services",
            "Inventario.API.Services",
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(nameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );

        services.AddSingleton<S3ObjectCustom>();
        return services;
    }
}
