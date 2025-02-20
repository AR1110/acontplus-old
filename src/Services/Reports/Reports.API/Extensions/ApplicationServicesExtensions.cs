namespace Reports.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAdoSqlServer, AdoSqlServer>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IRdlcReportService, RdlcReportService>();
            return services;
        }
    }
}
