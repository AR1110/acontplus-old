using Acontplus.Services.Extensions.Authentication;

namespace TechnicalSupport.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddTechnicalSupportServices(this IServiceCollection services,
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

        services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IDeviceSpecRepository, DeviceSpecRepository>();
        services.AddScoped<IDeviceRepository, DeviceRepository>();
        services.AddScoped<IModeloRepository, ModeloRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
        services.AddScoped<IOrderMaintenanceRepository, OrderMaintenanceRepository>();
        services.AddScoped<ISerieRepository, SerieRepository>();
        services.AddScoped<IStatsService, StatsService>();

        return services;
    }
}
