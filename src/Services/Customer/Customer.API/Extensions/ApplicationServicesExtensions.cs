using Customer.API.Data;
using Customer.API.Interfaces;
using Customer.API.Services;
using Microsoft.EntityFrameworkCore;

namespace Customer.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<CustomerContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ICompanyCustomerService, CompanyCustomerService>();

            services.AddScoped<RucService>();
            services.AddScoped<CedulaService>();
            return services;
        }
    }
}
