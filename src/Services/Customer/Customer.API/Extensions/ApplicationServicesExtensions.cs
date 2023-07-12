using Customer.Infrastructure.Data;
using Customer.API.Services;
using Lib.Common;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace Customer.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<CustomerContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));

            services.AddScoped<RucService>();
            services.AddScoped<CedulaService>();
            return services;
        }
    }
}
