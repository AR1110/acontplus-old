using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Mechanical.API.Helpers;
using Mechanical.Application.Services;
using Mechanical.Core.Interfaces;
using Mechanical.Infrastructure.Data;
using Mechanical.Infrastructure.Repositories;

namespace Mechanical.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<MechanicalContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));

            services.AddScoped<IADORepository, ADORepository>();
            services.AddScoped<IVehicleService, VehicleService>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            return services;
        }
    }
}
