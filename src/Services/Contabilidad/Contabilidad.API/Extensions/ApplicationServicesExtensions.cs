using Contabilidad.API.Services;

namespace Contabilidad.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers()
                .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                });

            services.AddDbContextPool<ContabilidadContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IAnticipoService, AnticipoService>();
            services.AddScoped<ICajaService, CajaService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IChequeService, ChequeService>();
            services.AddScoped<IComprobanteEgresoService, ComprobanteEgresoService>();
            services.AddScoped<IControlCajaService, ControlCajaService>();
            services.AddScoped<ICustomLogger, CustomLogger>();
            services.AddScoped<ICuentaPorCobrarService, CuentaPorCobrarService>();
            services.AddScoped<IMovimientoCajaService, MovimientoCajaService>();
            services.AddScoped<ISubEntidadFinancieraService, SubEntidadFinancieraService>();
            return services;
        }
    }
}
