using Acontplus.Persistence.SqlServer.DependencyInjection;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Restaurant.Infrastructure.Persistence;
using Restaurant.Infrastructure.Persistence.Mappings;

namespace Restaurant.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddRestaurantInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register Mapster
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;
        typeAdapterConfig.Scan(typeof(FloorMappingConfig).Assembly);

        services.AddSingleton(typeAdapterConfig);
        services.AddScoped<IMapper, ServiceMapper>();

        services.AddSqlServerPersistence<RestaurantContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("Restaurant.Infrastructure")));

        return services;
    }
}
