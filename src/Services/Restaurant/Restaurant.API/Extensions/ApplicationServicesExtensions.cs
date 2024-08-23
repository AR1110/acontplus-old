using Common.Application.Services;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Data;
using Restaurant.API.Interfaces;
using Restaurant.API.Services;
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
                .AddClasses(classes => classes.InNamespaces("Restaurant.API.Services"))
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsImplementedInterfaces()
                .WithTransientLifetime()
            );
            
            services.AddSingleton<S3ObjectCustom>();
            return services;
        }
    }
}
