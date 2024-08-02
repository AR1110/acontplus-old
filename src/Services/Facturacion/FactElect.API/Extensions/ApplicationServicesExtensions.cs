namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<FactElectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAtsService, AtsService>();
        services.AddScoped<ICaptchaService, CaptchaService>();
        services.AddScoped<ICedulaService, CedulaService>();
        services.AddScoped<ICookieService, CookieService>();
        services.AddScoped<ICompanyCustomerService, CompanyCustomerService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IDocumentoElectronicoService, DocumentoElectronicoService>();
        services.AddScoped<IDocumentoElectronicoErrorService, DocumentoElectronicoErrorService>();
        services.AddScoped<IFacturaService, FacturaService>();
        services.AddScoped<IGuiaRemisionService, GuiaRemisionService>();
        services.AddScoped<INotaCreditoService, NotaCreditoService>();
        services.AddScoped<IRetencionAtsService, RetencionAtsService>();
        services.AddScoped<IRucService, RucService>();
        return services;
    }
}
