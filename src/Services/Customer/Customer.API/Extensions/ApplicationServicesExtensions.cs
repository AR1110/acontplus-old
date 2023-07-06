using Customer.API.Data;
using Customer.API.Services;
using Microsoft.EntityFrameworkCore;

namespace Customer.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<CustomerContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

            services.AddScoped<RucService>();
            services.AddScoped<CedulaService>();
            return services;
        }
    }
}
