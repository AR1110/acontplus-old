using Contabilidad.API.Services;
using Newtonsoft.Json;

namespace Contabilidad.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
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
        services.AddScoped<ISubcategoryService, SubcategoryService>();
        services.AddScoped<ISubEntidadFinancieraService, SubEntidadFinancieraService>();
        services.AddScoped<ITipoService, TipoService>();
        services.AddScoped<IAccountingMovementService, AccountingMovementService>();
        services.AddScoped<IComprobanteIngresoService, ComprobanteIngresoService>();
        services.AddScoped<ICuentaPorPagarService, CuentaPorPagarService>();

        return services;
    }
}
