using Lib.Common;
using Microsoft.EntityFrameworkCore;
using TechnicalSupport.Infrastructure.Data;

namespace TechnicalSupport.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            return services;
        }
    }
}
