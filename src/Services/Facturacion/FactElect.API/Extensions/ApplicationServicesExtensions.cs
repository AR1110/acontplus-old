using FactElect.API.Data;
using FactElect.API.Services;

namespace FactElect.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<FactElectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAdoSqlServer, AdoSqlServer>();
        services.AddScoped<IAtsService, AtsService>();
        services.AddScoped<ICompanyCustomerService, CompanyCustomerService>();
        services.AddScoped<IDocumentoElectronicoService, DocumentoElectronicoService>();
        services.AddScoped<IDocumentoElectronicoErrorService, DocumentoElectronicoErrorService>();
        services.AddScoped<IGuiaRemisionService, GuiaRemisionService>();
        services.AddScoped<IFacturaService, FacturaService>();
        services.AddScoped<INotaCreditoService, NotaCreditoService>();
        services.AddScoped<IRetencionAtsService, RetencionAtsService>();

        services.AddScoped<RucService>();
        services.AddScoped<CedulaService>();
        return services;
    }
}
