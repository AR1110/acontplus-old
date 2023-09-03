using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Vet.Application.Reports;
using Vet.Application.Services;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<VetContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            //services.AddTransient(provider =>
            //{
            //    var optionsBuilder = new DbContextOptionsBuilder<RestaurantContext>();
            //    optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"), builder => builder.MigrationsAssembly("Restaurant.Infrastructure"));
            //    return new RestaurantContext(optionsBuilder.Options);
            //});
            services.AddScoped<IMedicalHistoryReport, MedicalHistoryReport>();
            services.AddScoped<IMedicalHistory, MedicalHistoryService>();
            services.AddScoped<IPetService, PetService>();
            
            return services;
        }
    }
}
