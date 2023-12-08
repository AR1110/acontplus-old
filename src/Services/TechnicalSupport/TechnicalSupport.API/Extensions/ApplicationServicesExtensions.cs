using Microsoft.EntityFrameworkCore;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Interfaces;
using TechnicalSupport.API.Services;
namespace TechnicalSupport.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IDeviceService, DeviceService>();
            services.AddScoped<IOrderService, OrderService>();
            return services;
        }
    }
}
