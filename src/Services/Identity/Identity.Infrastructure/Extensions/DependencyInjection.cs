using Acontplus.Persistence.SqlServer.DependencyInjection;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentityInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register Mapster
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;

        services.AddSingleton(typeAdapterConfig);
        services.AddScoped<IMapper, ServiceMapper>();

        services.AddSqlServerPersistence<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                x => x.MigrationsAssembly("Identity.Infrastructure")));

        return services;
    }
}
