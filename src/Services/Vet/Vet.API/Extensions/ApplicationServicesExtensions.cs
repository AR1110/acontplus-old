using Common.Infrastructure.Data.Repository.Implementations;
using Microsoft.AspNetCore.ResponseCompression;
using Newtonsoft.Json;

namespace Vet.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<VetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options =>
        {
            options.Level = System.IO.Compression.CompressionLevel.Optimal;
        });

        services.Configure<GzipCompressionProviderOptions>(options =>
        {
            options.Level = System.IO.Compression.CompressionLevel.Optimal;
        });

        services.AddControllers()
            .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver =
                        new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                }
            );

        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<IBehaviorTestService, BehaviorTestService>();
        services.AddScoped<IBreedService, BreedService>();
        services.AddScoped<IHealthCheckService, HealthCheckService>();
        services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();
        services.AddScoped<IPetService, PetService>();
        services.AddScoped<IPetTypeService, PetTypeService>();
        services.AddScoped<IStatsService, StatsService>();

        return services;
    }
}
