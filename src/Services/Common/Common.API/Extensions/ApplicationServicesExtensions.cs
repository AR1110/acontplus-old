
using Common.Application.Services;
using Common.Core.Interfaces;
using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Services.Common.Logs;

namespace Common.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContextPool<CommonContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<INotificacionService, NotificacionService>();
            services.AddScoped<ICustomLogger, CustomLogger>();
            return services;
        }
    }
}
