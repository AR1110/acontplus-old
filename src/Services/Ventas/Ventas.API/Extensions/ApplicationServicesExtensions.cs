using Autofac.Core;
using Newtonsoft.Json.Serialization;

namespace Ventas.API.Extensions;

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

        services.AddDbContextPool<VentasContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<INotaEntregaService, NotaEntregaService>();
        services.AddScoped<IProformaService, ProformaService>();
        services.AddScoped<IAprobacionDocService, AprobacionDocService>();

        services.AddScoped<ICustomLogger, CustomLogger>();
        return services;
    }
}
