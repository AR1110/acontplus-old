using Purchases.Api.Endpoints;
using Purchases.Api.Extensions;
using Serilog;

Log.Logger = new LoggerConfiguration()
           .WriteTo.Console()
           .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    var environment = builder.Environment.EnvironmentName;

    builder.Host.UseSerilog((hostContext, services, loggerConfiguration) =>
    {
        loggerConfiguration.ConfigureAdvancedLogger(hostContext.Configuration, environment);

        loggerConfiguration.ReadFrom.Configuration(hostContext.Configuration);
        loggerConfiguration.ReadFrom.Services(services);
    });


    // Use AppConfiguration for loading settings
    var configuration = ApplicationConfigurationBuilder.Load();
    builder.Configuration.AddConfiguration(configuration);

    builder.Services.AddComprasServices(builder.Configuration);

    builder.Services.AddInfrastructureHealthChecks();

    var app = builder.Build();

    if (app.Environment.IsDevelopment()) app.MapOpenApi();

    app.UseSerilogRequestLogging();

    app.UseApplicationMiddleware(builder.Environment);

    app.UseHttpsRedirection();

    app.UseRouting();

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapAllEndpoints();

    app.MapControllers().RequireAuthorization();

    app.MapHealthCheckEndpoints();

    await app.RunAsync();
}
catch (Exception ex)
{
    // Catch any critical startup errors
    Log.Fatal(ex, "API host terminated unexpectedly.");
}
finally
{
    // Ensure all buffered logs are flushed on application shutdown
    Log.CloseAndFlush();
}
