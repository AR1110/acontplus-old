using Scrutor;

namespace Accounting.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddAccountingServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddApplicationServices(configuration);

        services.AddAdvancedLoggingOptions(configuration);

        services.AddJwtAuthentication(configuration);

        services.AddOpenApi();

        services.AddHttpContextAccessor();

        services.AddControllers();

        services.AddResponseCompression();

        JsonConfigurationService.ConfigureAspNetCore(services, false);

        JsonConfigurationService.RegisterJsonConfiguration(services);

        services.AddDbContextPool<AccountingContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


        string[] scopedNameSpaces =
        [
            "Accounting.Infrastructure.Persistence.Repositories",
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
