namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<FactElectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICompanyCustomerService, CompanyCustomerService>();
        services.AddScoped<IDocumentoElectronicoErrorService, DocumentoElectronicoErrorService>();
        services.AddScoped<IGuiaRemisionService, GuiaRemisionService>();
        services.AddScoped<RucService>();
        services.AddScoped<CedulaService>();
        return services;
    }
}
