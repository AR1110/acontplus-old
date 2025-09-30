using Acontplus.Persistence.SqlServer.Repositories;
using Acontplus.Services.Extensions.Authentication;
using Acontplus.Utilities.Time;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using System.Text.Json.Serialization;
using Vet.Infrastructure.Persistence;
using Vet.Infrastructure.Persistence.Repositories;

namespace Vet.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddVetServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAcontplusServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        services.AddControllers();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<VetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

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
