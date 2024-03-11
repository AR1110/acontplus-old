using Common.Core.Interfaces;
using Common.Infrastructure.Repository;
using Reports.Application.Services;
using Reports.Core.Interfaces;
using Services.Common.Logs;

namespace Reports.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IADOSqlServer, ADOSqlServer>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IRdlcReportService, RdlcReportService>();
            services.AddSingleton<LogWriter>();
            return services;
        }
    }
}
