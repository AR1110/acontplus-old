using Configuracion.API.Data;
using Configuracion.API.Interfaces;
using Configuracion.API.Services;
using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;

namespace Configuracion.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ConfigContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IEstablecimientoAsignacionService, EstablecimientoAsignacionService>();
            services.AddScoped<IEstadoDocumentoService, EstadoDocumentoService>();
            services.AddScoped<IPrinterService, PrinterService>();

            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
