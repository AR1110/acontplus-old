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

            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
