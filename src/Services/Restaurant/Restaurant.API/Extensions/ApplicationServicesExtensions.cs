using Common.Application.Services;
using Common.Core.Interfaces;
using Common.Reports.Services;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Helpers;
using Restaurant.Application.Services;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<RestaurantContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            //
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IRecipe, RecipeService>();
            services.AddScoped<IAppTableService, AppTableService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IIngredientService, IngredientService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IConfigurationService, ConfigurationService>();
            services.AddScoped<IMenuItemService, MenuItemService>();
            services.AddScoped<IPromotionService, PromotionService>();
            services.AddScoped<IPromotionMenuService, PromotionMenuService>();
            services.AddScoped<IStorageService, StorageService>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            return services;
        }
    }
}
