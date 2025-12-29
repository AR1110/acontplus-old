using Billing.Application.Services.Sri;

namespace Billing.Application;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSriAuthentication(
        this IServiceCollection services,
        Action<SriAuthenticationOptions> configureOptions,
        Action<RecaptchaSolverOptions>? configureRecaptchaSolver = null)
    {
        services.Configure(configureOptions);
        if (configureRecaptchaSolver != null)
        {
            services.Configure(configureRecaptchaSolver);
        }

        services.AddHttpClient<IRecaptchaSolver, TwoCaptchaSolver>(client =>
        {
            // BaseUrl can still be overridden via options
        });
        services.AddScoped<IRecaptchaSolver, TwoCaptchaSolver>();

        services.AddHttpClient<ISriAuthenticationService, SriAuthenticationService>();
        services.AddScoped<ISriAuthenticationService, SriAuthenticationService>();

        return services;
    }
}
