using Acontplus.Utilities.Time;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using System.Text.Json.Serialization;

namespace TechnicalSupport.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddTechnicalSupportServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

        services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.AddControllers();

        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new NullableDateTimeConverter());
            options.SerializerOptions.PropertyNameCaseInsensitive = true;
            options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        });

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
