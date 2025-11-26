using Acontplus.Services.Configuration;
using Acontplus.Services.Extensions;
using Common.Api.Endpoints;
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

    // Add services to the container.
    builder.Services.AddCommonApplicationServices(builder.Configuration);

    var app = builder.Build();

    if (app.Environment.IsDevelopment()) app.MapOpenApi();

    app.UseSerilogRequestLogging();

    app.UseResponseCompression();

    app.UseRateLimiter();

    app.UseApplicationMiddleware(builder.Environment);

    app.UseRouting();

    app.UseHttpsRedirection();

    app.UseAuthentication();

    app.UseAuthorization();

    // Add endpoints to the web application with minimal API's.
    app.MapCommonEndpoints();

    //using var scope = app.Services.CreateScope();
    //var services = scope.ServiceProvider;
    //var context = services.GetRequiredService<CommonContext>();
    //var logger = services.GetRequiredService<ILogger<Program>>();
    //try
    //{
    //    await context.Database.MigrateAsync();
    //    await CommonContextSeed.SeedAsync(context);
    //}
    //catch (Exception ex)
    //{
    //    logger.LogError(ex, "An error occured during migration");
    //}

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

