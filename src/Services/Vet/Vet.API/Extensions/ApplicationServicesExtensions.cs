using Microsoft.EntityFrameworkCore;
using Vet.Application.Reports;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<VetContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
            //services.AddTransient(provider =>
            //{
            //    var optionsBuilder = new DbContextOptionsBuilder<RestaurantContext>();
            //    optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"), builder => builder.MigrationsAssembly("Restaurant.Infrastructure"));
            //    return new RestaurantContext(optionsBuilder.Options);
            //});
            services.AddScoped<IMedicalHistoryReport, MedicalHistoryReport>();
            //services.AddScoped<RestaurantContext, RestaurantContext>(); 
            return services;
        }
    }
}
