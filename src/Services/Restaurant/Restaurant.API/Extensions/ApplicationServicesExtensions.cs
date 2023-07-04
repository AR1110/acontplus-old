using Microsoft.EntityFrameworkCore;
using Restaurant.API.Application;
using Restaurant.Application;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using AutoMapper;
using Restaurant.API.Helpers;

namespace Restaurant.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<RestaurantContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
            //services.AddTransient(provider =>
            //{
            //    var optionsBuilder = new DbContextOptionsBuilder<RestaurantContext>();
            //    optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"), builder => builder.MigrationsAssembly("Restaurant.Infrastructure"));
            //    return new RestaurantContext(optionsBuilder.Options);
            //});
            services.AddScoped<ITokenService, TokenService>();
            //services.AddScoped<RestaurantContext, RestaurantContext>();
            services.AddScoped<IRecipe, RecipeService>();
            //services.AddScoped<DbAccess, DbAccess>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            return services;
        }
    }
}