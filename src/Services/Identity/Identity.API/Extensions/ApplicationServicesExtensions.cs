using Acontplus.ApiDocumentation;
using Acontplus.Persistence.SqlServer.Repositories;
using Acontplus.Services.Extensions.Authentication;
using Acontplus.Services.Extensions.Infrastructure;
using Acontplus.Utilities.Time;
using Identity.API.Persistence;
using System.Text.Json.Serialization;

namespace Identity.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddJwtAuthentication(configuration);

        services.AddResponseCompressionServices();

        services.AddAdvancedLoggingOptions(configuration);

        services.AddDbContextPool<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers();

        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new NullableDateTimeConverter());
            options.SerializerOptions.PropertyNameCaseInsensitive = true;
            options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        });

        services.AddApiVersioningAndDocumentation();

        services.AddOpenApi();

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
