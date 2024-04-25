using Microsoft.EntityFrameworkCore;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Interfaces;
using TechnicalSupport.API.Services;
namespace TechnicalSupport.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IBrandService, BrandService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IDeviceSpecService, DeviceSpecService>();
            services.AddScoped<IDeviceService, DeviceService>();
            services.AddScoped<IModeloService, ModeloService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IOrderDetailService, OrderDetailService>();
            services.AddScoped<IOrderMaintenanceService, OrderMaintenanceService>();
            services.AddScoped<ISerieService, SerieService>();
            services.AddScoped<IStatsService, StatsService>();
            //var config = new AutoMapper.MapperConfiguration(cfg =>
            //{
            //    cfg.AddProfile(new MappingProfiles());
            //});
            //var mapper = config.CreateMapper();
            //services.AddSingleton(mapper);
            services.AddAutoMapper(typeof(MappingProfiles));
            return services;
        }
    }
}
