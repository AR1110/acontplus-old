using System.IO.Compression;
using Common.Logging;
using Microsoft.AspNetCore.ResponseCompression;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Identity.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAdvancedLogging(configuration);
        services.AddDbContextPool<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Optimal; });

        services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        services.AddHostedService<TokenCleanupAndArchivalService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IAdoRepository, AdoRepository>();
        services.AddScoped<ILoginFailedService, LoginFailedService>();
        services.AddScoped<ILoginHistoryService, LoginHistoryService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}
