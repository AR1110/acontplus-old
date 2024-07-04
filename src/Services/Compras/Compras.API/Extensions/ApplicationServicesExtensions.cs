namespace Compras.API.Extensions;

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
        services.AddDbContextPool<ComprasContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<FileTxt>();
        services.AddScoped<IAdoSqlServer, AdoSqlServer>();
        services.AddScoped<ICustomLogger, CustomLogger>();
        services.AddScoped<IDocumentoTempService, DocumentoTempService>();
        services.AddScoped<IProveedorService, ProveedorService>();
        services.AddScoped<ILiquidacionCompraService, LiquidacionCompraService>();
        services.AddScoped<IFacturaCompraService, FacturaCompraService>();
        services.AddScoped<IOrdenCompraService, OrdenCompraService>();
        services.AddScoped<INotaCreditoService, NotaCreditoService>();
        services.AddScoped<ICompraNoHabitualService, CompraNoHabitualService>();
        services.AddScoped<IDocumentoRecibidoService, DocumentoRecibidoService>();
        services.AddScoped<IWebServiceSri, WebServiceSri>();
        return services;
    }
}
