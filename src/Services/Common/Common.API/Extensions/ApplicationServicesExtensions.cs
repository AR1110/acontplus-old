using Common.Core.Time;
using Scrutor;

namespace Common.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        services.AddDbContextPool<CommonContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        services.AddOpenApi();

        //services.ConfigureHttpJsonOptions(options =>
        //{
        //    options.SerializerOptions.Converters.Add(new NullableDateTimeConverter());
        //    options.SerializerOptions.PropertyNameCaseInsensitive = true;
        //    options.SerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        //    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        //});

        string[] scopedNameSpaces =
        [
            "Common.API.Endpoints.Implementations",
            "Common.API.Services"
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(scopedNameSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
        ); 
        string[] nameTrascientSpaces =
        [
            "Common.Infrastructure.Data.Repository.Implementations",
            "Common.Services.Extensions",
        ];

        services.Scan(scan => scan
            .FromApplicationDependencies()
            .AddClasses(classes => classes.InNamespaces(nameTrascientSpaces))
            .UsingRegistrationStrategy(RegistrationStrategy.Skip)
            .AsImplementedInterfaces()
            .WithTransientLifetime()
        );

        return services;
    }
}
