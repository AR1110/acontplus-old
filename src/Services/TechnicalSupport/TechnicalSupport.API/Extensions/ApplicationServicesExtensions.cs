using Lib.Common;
using Microsoft.EntityFrameworkCore;
using TechnicalSupport.Application.Services;
using TechnicalSupport.Core.Interfaces;
using TechnicalSupport.Infrastructure.Data;

namespace TechnicalSupport.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IDeviceService, DeviceService>();
            return services;
        }
    }
}
