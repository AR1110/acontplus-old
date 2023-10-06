using Contabilidad.Application.Servicios;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Lib.Common;
using Microsoft.EntityFrameworkCore;

namespace ApiContabilidad.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ContabilidadContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            
            services.AddScoped<ISubCategoriaService, SubCategoriaService>();
            return services;
        }
    }
}
