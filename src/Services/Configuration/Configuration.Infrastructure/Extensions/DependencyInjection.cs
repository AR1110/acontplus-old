using Acontplus.Persistence.SqlServer.DependencyInjection;
using Configuration.Infrastructure.Persistence;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;

namespace Configuration.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddConfigurationInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register Mapster
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;

        services.AddSingleton(typeAdapterConfig);
        services.AddScoped<IMapper, ServiceMapper>();

        services.AddSqlServerPersistence<ConfigurationContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("Configuration.Infrastructure")));

        return services;
    }
}
