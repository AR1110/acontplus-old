using Acontplus.Services.Configuration;
using Acontplus.Services.Extensions;
using Acontplus.Services.Extensions.Authentication;
using Common.Infrastructure.Persistence;
using Scrutor;

namespace Common.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddCommonApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<CommonContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        string[] scopedNameSpaces =
        [
            "Common.Application.Services",
            "Acontplus.Persistence.SqlServer.Repositories",

            "Acontplus.Services.Extensions.Context"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        );

        return services;
    }
}
