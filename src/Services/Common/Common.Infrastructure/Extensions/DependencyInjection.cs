using Acontplus.Persistence.SqlServer.DependencyInjection;
using Common.Infrastructure.Persistence;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Common.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddCommonInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var config = TypeAdapterConfig.GlobalSettings;
        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();

        services.AddSqlServerPersistence<CommonContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("Common.Infrastructure")));

        return services;
    }
}
