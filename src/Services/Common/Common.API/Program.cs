using Acontplus.Services.Configuration;
using Acontplus.Services.Extensions;
using Acontplus.Services.Extensions.Authentication;
using Acontplus.Services.Extensions.Middleware;
using Common.API.Endpoints;
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
    builder.Services.AddApplicationServices(builder.Configuration);

    builder.Services.AddJwtAuthentication(builder.Configuration);

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment()) app.MapOpenApi();

    app.UseResponseCompression();

    app.UseAcontplusExceptionHandling();

    app.UseAcontplusServices(builder.Environment);

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

