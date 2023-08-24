using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Helpers;
using Restaurant.Application;
using Restaurant.Application.Services;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Restaurant.Infrastructure.Repositories;

namespace Restaurant.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<RestaurantContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));

            services.AddScoped<IADORepository, ADORepository>();
            services.AddScoped<IRecipe, RecipeService>();
            services.AddScoped<IAppTableService, AppTableService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IIngredientService, IngredientService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IConfigurationService, ConfigurationService>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            return services;
        }
    }
}
