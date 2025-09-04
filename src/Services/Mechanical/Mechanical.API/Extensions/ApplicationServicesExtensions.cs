using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO.Compression;

namespace Mechanical.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddMechanicalServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLoggingOptions(configuration);

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
            });

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
