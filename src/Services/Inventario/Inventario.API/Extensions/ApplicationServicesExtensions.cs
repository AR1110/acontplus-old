using Common.Application.Services;
using Common.Core.Interfaces;
using Inventario.Application.Services;
using Inventario.Core.Interfaces;
using Inventario.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Inventario.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<InventarioContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IStockFisicoService, StockFisicoService>();
            services.AddScoped<IS3StorageService, S3StorageService>();
            services.AddScoped<IArticuloFraccionadoService, ArticuloFraccionadoService>();
            services.AddScoped<ITransaccionService, TransaccionService>();
            return services;
        }
    }

}
