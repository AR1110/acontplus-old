using Configuracion.API.Interfaces.WizardConfig;
using Configuracion.API.Services.WizardConfig;

namespace Configuracion.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<ConfigContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        services.AddScoped<ICompanyDemoStepService, CompanyDemoStepService>();
        services.AddScoped<IDemoStepService, DemoStepService>();
        services.AddScoped<IEmailConfigService, EmailConfigService>();
        services.AddScoped<IEstablecimientoAsignacionService, EstablecimientoAsignacionService>();
        services.AddScoped<IEstadoDocumentoService, EstadoDocumentoService>();
        services.AddScoped<IFirmaElectronicaService, FirmaElectronicaService>();
        services.AddScoped<IPrinterService, PrinterService>();
        services.AddScoped<IPrintService, PrintService>();
        services.AddScoped<IEstablecimientoLogoService, EstablecimientoLogoService>();
        services.AddScoped<IPuntoEmisionAsignacionService, PuntoEmisionAsignacionService>();
        services.AddScoped<IBodegaAsignacionService, BodegaAsignacionService>();
        services.AddScoped<IGeneralConfigService, GeneralConfigService>();
        services.AddScoped<IDocConfigService, DocConfigService>();
        services.AddScoped<IUserCustomerService, UserCustomerService>();
        services.AddScoped<IUserCustomerRoleService, UserCustomerRoleService>();
        services.AddScoped<IUserCustomerRequestService, UserCustomerRequestService>();
        services.AddScoped<IUserCustomerPermissionService, UserCustomerPermissionService>();
        services.AddScoped<IUserProfileService, UserProfileService>();
        services.AddScoped<IEstablishmentService, EstablishmentService>();
        services.AddScoped<IPtoEmisionService, PtoEmisionService>();
        services.AddScoped<ICompanyService, CompanyService>();

        services.AddScoped<ICustomLogger, CustomLogger>();
        services.AddScoped<ITurnoService, TurnoService>();
        services.AddScoped<IWhatsappUsageService, WhatsappUsageService>();

        services.AddAutoMapper(typeof(MappingProfiles));
        return services;
    }
}
