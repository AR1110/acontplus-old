using FactElect.Application.DTOs;
using Microsoft.Extensions.DependencyInjection;

namespace FactElect.Application;

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
