using Microsoft.EntityFrameworkCore;

namespace Mechanical.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddMechanicalServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        services.AddControllers();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<MechanicalContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<IVehicleRepository, VehicleRepository>();
        services.AddScoped<ISupportRepository, SupportRepository>();
        services.AddScoped<ISupportDetailService, SupportDetailService>();
        services.AddScoped<IInspectionService, InspectionService>();
        return services;
    }
}
