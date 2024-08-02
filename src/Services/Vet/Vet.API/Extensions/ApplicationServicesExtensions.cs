using Newtonsoft.Json;

namespace Vet.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<VetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers()
            .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver =
                        new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                }
            );

        services.AddSwaggerDocumentation();

        services.AddScoped<IBehaviorTestService, BehaviorTestService>();
        services.AddScoped<IBreedService, BreedService>();
        services.AddScoped<ICustomLogger, CustomLogger>();
        services.AddScoped<IHealthCheckService, HealthCheckService>();
        services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();
        services.AddScoped<IPetService, PetService>();
        services.AddScoped<IPetTypeService, PetTypeService>();
        services.AddScoped<IStatsService, StatsService>();

        return services;
    }
}
