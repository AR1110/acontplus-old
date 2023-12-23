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

            services.AddScoped<FileTxt>();
            services.AddScoped<IProveedorService, ProveedorService>();
            services.AddScoped<ILiquidacionCompraService, LiquidacionCompraService>();
            services.AddScoped<IFacturaCompraService, FacturaCompraService>();
            services.AddScoped<IOrdenCompraService, OrdenCompraService>();
            services.AddScoped<INotaCreditoProveedorService, NotaCreditoProveedorService>();

            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
