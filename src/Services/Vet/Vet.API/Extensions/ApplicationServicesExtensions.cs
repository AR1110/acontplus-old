using Acontplus.Persistence.Common.Repositories;
using Microsoft.AspNetCore.ResponseCompression;
using Newtonsoft.Json;
using System.IO.Compression;
using Acontplus.Persistence.SqlServer.Repositories;
using Vet.Infrastructure.Persistence;
using Vet.Infrastructure.Persistence.Repositories;

namespace Vet.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddVetServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddDbContextPool<VetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.AddControllers()
            .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver =
                        new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                }
            );

        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<IBehaviorTestRepository, BehaviorTestRepository>();
        services.AddScoped<IBreedRepository, BreedRepository>();
        services.AddScoped<IHealthCheckRepository, HealthCheckRepository>();
        services.AddScoped<IMedicalHistoryRepository, MedicalHistoryRepository>();
        services.AddScoped<IPetRepository, PetRepository>();
        services.AddScoped<IPetTypeRepository, PetTypeRepository>();
        services.AddScoped<IStatsService, StatsService>();

        return services;
    }
}
