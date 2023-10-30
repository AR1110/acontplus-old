using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;
using Ventas.API.Data;
using Ventas.API.Interfaces;
using Ventas.API.Services;

namespace Ventas.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<VentasContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<INotaEntregaService, NotaEntregaService>();

            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
