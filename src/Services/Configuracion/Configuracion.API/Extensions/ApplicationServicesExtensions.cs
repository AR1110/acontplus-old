using Scrutor;

namespace Configuracion.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {

        services.AddHttpContextAccessor();

        services.AddDbContextPool<ConfigContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        services.AddAutoMapper(typeof(MappingProfiles));

        string[] nameSpaces =
        [
            "Common.Application.Services",
            "Common.Infrastructure.Repository.Implementations",
            "Configuracion.API.Services",
            "Configuracion.API.Services.Sri",
            "Configuracion.API.Services.WizardConfig"
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
