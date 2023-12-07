using Mechanical.API.Helpers;
using Mechanical.Application.Services;
using Mechanical.Core.Interfaces;
using Mechanical.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Mechanical.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<MechanicalContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<ISupportService, SupportService>();
            services.AddScoped<ISupportDetailService, SupportDetailService>();
            services.AddScoped<IInspectionService, InspectionService>();
            return services;
        }
    }
}
