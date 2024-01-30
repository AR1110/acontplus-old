using FactElect.Application.Services;
using FactElect.Core.Interfaces;
using FactElect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FactElect.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<FactElectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            //           
            services.AddScoped<IDocumentoElectronicoErrorService, DocumentoElectronicoErrorService>();
            services.AddScoped<IGuiaRemisionService, GuiaRemisionService>();
            return services;
        }
    }
}
