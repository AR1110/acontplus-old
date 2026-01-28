using Acontplus.Persistence.SqlServer.DependencyInjection;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sales.Infrastructure.Persistence;

namespace Sales.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddSalesInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;

        services.AddSingleton(typeAdapterConfig);
        services.AddScoped<IMapper, ServiceMapper>();

        services.AddSqlServerPersistence<SalesContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), x =>
                x.MigrationsAssembly("Sales.Infrastructure")));

        return services;
    }
}
