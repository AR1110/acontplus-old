using Customer.API.Data;
using Customer.API.Services;
using Lib.Common;
using Microsoft.EntityFrameworkCore;

namespace Customer.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<CustomerContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<RucService>();
            services.AddScoped<CedulaService>();
            return services;
        }
    }
}
