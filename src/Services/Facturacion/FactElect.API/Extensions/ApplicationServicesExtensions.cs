using Scrutor;

namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<FactElectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] nameSpaces =
        [
            "Common.Infrastructure.Repository",
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
