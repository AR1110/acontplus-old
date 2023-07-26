using Contabilidad.Infrastructure.Data;
using Lib.Common;
using Microsoft.EntityFrameworkCore;

namespace ApiContabilidad.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ContabilidadContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            return services;
        }
    }
}
