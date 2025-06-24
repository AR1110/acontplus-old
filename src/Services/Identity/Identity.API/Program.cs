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
    var configuration = AppConfiguration.Load();
    builder.Configuration.AddConfiguration(configuration);
    // Add services to the container.
    builder.Services.AddApplicationServices(builder.Configuration);

    builder.Services.AddIdentityService(builder.Configuration);

    builder.Services.AddApiVersioningAndDocumentation();

    builder.Services.AddOpenApi();

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseApiVersioningAndDocumentation();
        app.MapOpenApi();
    }

    app.UseResponseCompression();

    app.UseMiddleware<ExceptionMiddleware>();

    app.UseMiddleware<MobileRequestMiddleware>();

    app.UseRouting();

    app.UseHttpsRedirection();

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapControllers();

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
