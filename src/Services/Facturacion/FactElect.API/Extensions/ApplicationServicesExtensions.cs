using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Scrutor;

namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });
        
        services.AddDbContextPool<FactElectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] nameSpaces =
        [
            "Common.Infrastructure.Repository.Implementations",
            "FactElect.API.Services",
            "FactElect.API.Services.Logistica",
            "FactElect.API.Services.RetencionAts",
            "FactElect.API.Services.Sri",
            "FactElect.Application.Services"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(nameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );

        return services;
    }
}
