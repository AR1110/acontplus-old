using ApiConfig.Data;
using ApiConfig.Interfaces;
using ApiConfig.Services;
using Lib.Common;
using Microsoft.EntityFrameworkCore;

namespace ApiConfig.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ConfigContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            
            services.AddScoped<IEstablecimientoAsignacionService, EstablecimientoAsignacionService>();
            return services;
        }
    }
}
