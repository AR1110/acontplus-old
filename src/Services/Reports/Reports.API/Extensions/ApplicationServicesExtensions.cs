using Microsoft.EntityFrameworkCore;
using Reports.API.Data;
using Reports.Application.Services;
using Reports.Core.Interfaces;

namespace Reports.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<ReportsContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IRdlcReportService, RdlcReportService>();
            return services;
        }
    }
}
