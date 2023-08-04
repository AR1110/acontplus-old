using Microsoft.EntityFrameworkCore;
using Restaurant.Application;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Restaurant.API.Helpers;
using System.Configuration;
using Lib.Common;
using Restaurant.Application.Services;
using Restaurant.Infrastructure.Repositories;

namespace Restaurant.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<RestaurantContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            //services.AddTransient(provider =>
            //{
            //    var optionsBuilder = new DbContextOptionsBuilder<RestaurantContext>();
            //    optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"), builder => builder.MigrationsAssembly("Restaurant.Infrastructure"));
            //    return new RestaurantContext(optionsBuilder.Options);
            //});
            services.AddScoped<IADORepository, ADORepository>();
            //services.AddScoped<RestaurantContext, RestaurantContext>();
            services.AddScoped<IRecipe, RecipeService>();
            services.AddScoped<IAppTableService, AppTableService>();
            //services.AddScoped<DbAccess, DbAccess>();
            services.AddScoped<IIngredientService, IngredientService>();
            
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            return services;
        }
    }
}