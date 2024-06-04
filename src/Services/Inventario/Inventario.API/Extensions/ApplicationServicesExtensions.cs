namespace Inventario.API.Extensions;

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
        services.AddDbContextPool<InventarioContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IStockFisicoService, StockFisicoService>();
        services.AddScoped<IS3StorageService, S3StorageService>();
        services.AddScoped<IArticuloFraccionadoService, ArticuloFraccionadoService>();
        services.AddScoped<ITransaccionService, TransaccionService>();
        services.AddScoped<IStockService, StockService>();
        services.AddScoped<IProductPhotoService, ProductPhotoService>();
        services.AddScoped<ISubcategoryPhotoService, SubcategoryPhotoService>();
        services.AddScoped<IArticuloCodigoBarraService, ArticuloCodigoBarraService>();
        services.AddScoped<IPrecioMasivoService, PrecioMasivoService>();
        services.AddScoped<IMassiveTaxService, MassiveTaxService>();
        services.AddScoped<ITransferenciaBodegaService, TransferenciaBodegaService>();
        services.AddScoped<IConsolidacionService, ConsolidacionService>();
        services.AddScoped<ILotPriceService, LotPriceService>();
        services.AddScoped<IMeasureService, MeasureService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ISubFamiliaService, SubFamiliaService>();

        services.AddScoped<ICustomLogger, CustomLogger>();
        services.AddSingleton<S3ObjectCustom>();
        return services;
    }
}
