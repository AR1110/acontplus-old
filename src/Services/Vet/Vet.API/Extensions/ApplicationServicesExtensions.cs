using Microsoft.EntityFrameworkCore;
using Vet.API.Data;
using Vet.API.Interfaces;
using Vet.API.Services;

namespace Vet.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<VetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IMedicalHistory, MedicalHistoryService>();
            services.AddScoped<IPetService, PetService>();
            return services;
        }
    }
}
