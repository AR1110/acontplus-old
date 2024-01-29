using Contabilidad.Application.Servicios;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;

namespace Contabilidad.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ContabilidadContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ISubCategoriaService, SubCategoriaService>();
            services.AddScoped<ICajaService, CajaService>();
            services.AddScoped<IControlCajaService, ControlCajaService>();
            services.AddScoped<IMovimientoCajaService, MovimientoCajaService>();
            services.AddScoped<IAnticipoService, AnticipoService>();
            services.AddScoped<IComprobanteEgresoService, ComprobanteEgresoService>();
            services.AddScoped<ICuentaPorCobrarService, CuentaPorCobrarService>();


            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
