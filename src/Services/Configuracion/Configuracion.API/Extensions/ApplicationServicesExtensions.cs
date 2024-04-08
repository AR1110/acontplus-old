using Configuracion.API.Data;
using Configuracion.API.Interfaces;
using Configuracion.API.Interfaces.Sri;
using Configuracion.API.Services;
using Configuracion.API.Services.Sri;
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
            services.AddScoped<IPrintService, PrintService>();
            services.AddScoped<IEstablecimientoLogoService, EstablecimientoLogoService>();
            services.AddScoped<IPuntoEmisionAsignacionService, PuntoEmisionAsignacionService>();
            services.AddScoped<IBodegaAsignacionService, BodegaAsignacionService>();
            services.AddScoped<IGeneralConfigService, GeneralConfigService>();
            services.AddScoped<IDocConfigService, DocConfigService>();
            services.AddScoped<IUserCustomerService, UserCustomerService>(); 
            services.AddScoped<IUserCustomerRoleService, UserCustomerRoleService>(); 
            services.AddScoped<IUserCustomerRequestService, UserCustomerRequestService>(); 
            services.AddScoped<IUserCustomerPermissionService, UserCustomerPermissionService>();
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<IEstablishmentService, EstablishmentService>();

            services.AddSingleton<LogWriter>();

            services.AddAutoMapper(typeof(MappingProfiles));
            return services;
        }
    }
}
