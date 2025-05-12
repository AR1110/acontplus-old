using Common.Infrastructure.Data.Repository.Implementations;
using Common.Logging;
using Contabilidad.API.Services;
using Microsoft.AspNetCore.ResponseCompression;
using Newtonsoft.Json;

namespace Contabilidad.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLogging(configuration);

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options =>
        {
            options.Level = System.IO.Compression.CompressionLevel.Optimal;
        });

        services.Configure<GzipCompressionProviderOptions>(options =>
        {
            options.Level = System.IO.Compression.CompressionLevel.Optimal;
        });

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        services.AddDbContextPool<ContabilidadContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<IAnticipoService, AnticipoService>();
        services.AddScoped<IBancoService, BancoService>();
        services.AddScoped<ICajaService, CajaService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IChequeService, ChequeService>();
        services.AddScoped<IComprobanteEgresoService, ComprobanteEgresoService>();
        services.AddScoped<IControlCajaService, ControlCajaService>();
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
