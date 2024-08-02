using Microsoft.EntityFrameworkCore;

namespace Common.TestApi.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
       IConfiguration configuration)
        {

            services.AddDbContextPool<TestContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


            return services;
        }
    }
}
