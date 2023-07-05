using Customer.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Customer.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<CustomerContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
            return services;
        }
    }
}
