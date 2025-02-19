using Common.Infrastructure.Repository.Implementations;

namespace TechnicalSupport.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<TechnicalSupportContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        services.AddScoped<IAdoRepository, AdoRepository>();
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
