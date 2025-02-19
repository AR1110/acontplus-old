using Common.Infrastructure.Repository.Implementations;

namespace Identity.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContextPool<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        services.AddHostedService<TokenCleanupService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<ILoginFailedService, LoginFailedService>();
        services.AddScoped<ILoginHistoryService, LoginHistoryService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}
