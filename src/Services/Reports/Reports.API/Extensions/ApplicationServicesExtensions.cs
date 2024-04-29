namespace Reports.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IADOSqlServer, ADOSqlServer>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IRdlcReportService, RdlcReportService>();
            services.AddScoped<ICustomLogger, CustomLogger>();
            return services;
        }
    }
}
