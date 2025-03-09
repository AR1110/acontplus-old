using Newtonsoft.Json.Serialization;
using Scrutor;


namespace Restaurant.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddControllers()
                .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver =
                        new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                });

            services.AddDbContextPool<RestaurantContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            string[] nameSpaces =
           [
               "Common.Infrastructure.Data.Repository.Implementations",
                "Restaurant.API.Services"
           ];

            services.Scan(scan => scan
                .FromApplicationDependencies()
                .AddClasses(classes => classes.InNamespaces(nameSpaces))
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsImplementedInterfaces()
                .WithTransientLifetime()
            );

            services.AddSingleton<S3ObjectCustom>();
            return services;
        }
    }
}
