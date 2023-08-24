using Contabilidad.Application.Servicios;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Contabilidad.Infrastructure.Repositories;
using Lib.Common;
using Microsoft.EntityFrameworkCore;

namespace ApiContabilidad.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ContabilidadContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            services.AddScoped<IADORepository, ADORepository>();
            services.AddScoped<ISubCategoriaService, SubCategoriaService>();
            return services;
        }
    }
}
