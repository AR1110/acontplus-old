using Billing.Application.Services.Sri;

namespace Billing.Application;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSriAuthentication(
        this IServiceCollection services,
        Action<SriAuthenticationOptions> configureOptions)
    {
        services.Configure(configureOptions);
        services.AddHttpClient<ISriAuthenticationService, SriAuthenticationService>();
        services.AddScoped<ISriAuthenticationService, SriAuthenticationService>();

        return services;
    }
}
