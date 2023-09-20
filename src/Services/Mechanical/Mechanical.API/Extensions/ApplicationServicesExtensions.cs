using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Mechanical.API.Helpers;
using Mechanical.Application.Services;
using Mechanical.Core.Interfaces;
using Mechanical.Infrastructure.Data;

namespace Mechanical.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<MechanicalContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));

            
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<ISupportService, SupportService>();
            services.AddScoped<IMaintenanceService, MaintenanceService>();
            services.AddScoped<IInspectionService, InspectionService>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            return services;
        }
    }
}
