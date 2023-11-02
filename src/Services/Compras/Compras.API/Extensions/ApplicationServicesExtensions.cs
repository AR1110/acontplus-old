using Compras.API.Data;
using Compras.API.Interfaces;
using Compras.API.Services;
using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;

namespace Compras.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ComprasContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IProveedorService, ProveedorService>(); 

            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
