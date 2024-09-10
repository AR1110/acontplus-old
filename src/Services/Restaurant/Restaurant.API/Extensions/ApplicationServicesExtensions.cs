using Common.Core.Models;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Data;
using Scrutor;


namespace Restaurant.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<RestaurantContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            
            services.Scan(scan => scan
                .FromApplicationDependencies()
                .AddClasses(classes => classes.InNamespaces("Restaurant.API.Services", "Common.Application.Services"))
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsImplementedInterfaces()
                .WithTransientLifetime()
            );
            
            services.AddSingleton<S3ObjectCustom>();
            return services;
        }
    }
}
