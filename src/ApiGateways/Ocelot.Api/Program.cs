using Acontplus.Infrastructure.Extensions;
using Acontplus.Logging;
using Acontplus.Services.Configuration;
using Acontplus.Services.Extensions.Authentication;
using Acontplus.Services.Extensions.Middleware;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Serilog;

// 1. Optional: Create a bootstrap logger for early startup issues
//    This captures logs from WebApplication.CreateBuilder() itself.
Log.Logger = new LoggerConfiguration()
           .WriteTo.Console()
           .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Get environment name once for clarity and re-use
    var environment = builder.Environment.EnvironmentName;

    // 2. Configure Serilog for the web host using the new extension method
    builder.Host.UseSerilog((hostContext, services, loggerConfiguration) =>
    {
        // Call the new method to apply your advanced logging settings to the LoggerConfiguration
        loggerConfiguration.ConfigureAdvancedLogger(hostContext.Configuration, environment);

        // This part tells Serilog to load its configuration from appsettings.json
        // and resolve any services (e.g., custom enrichers requiring DI)
        loggerConfiguration.ReadFrom.Configuration(hostContext.Configuration);
        loggerConfiguration.ReadFrom.Services(services);
    });

    builder.Services.AddAdvancedLoggingOptions(builder.Configuration);

    // Environment and Configuration Setup
    builder.WebHost.ConfigureKestrel(serverOptions =>
    {
        serverOptions.Limits.MaxRequestBufferSize = 1048576;
        serverOptions.Limits.MaxRequestLineSize = 1048576;
    });

    const string corsPolicy = "OcelotCorsPolicy";

    // Use AppConfiguration for loading settings
    var configuration = ApplicationConfigurationBuilder.Load();
    builder.Configuration.AddConfiguration(configuration);

    // Secure Environment Variable Retrieval (consider secret management for sensitive data)
    var safeOrigins = builder.Configuration["SafeOrigins"]?.Split(",")
                      ?? ["http://localhost:3000", "https://localhost:3000"];

    // Ocelot Configuration (consider using environment variables for dynamic configuration)
    builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", false, true);

    builder.Services.AddOcelot();

    builder.Services.AddResponseCompression();

    // Identity Services (adapt to your specific authentication mechanism)
    builder.Services.AddJwtAuthentication(builder.Configuration);

    // CORS Configuration
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(corsPolicy, policy =>
        {
            policy
                .WithOrigins(safeOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("Content-Disposition")
                .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
        });
    });

    builder.Services.AddInfrastructureHealthChecks();

    var app = builder.Build();

    app.UseSerilogRequestLogging(); // Use Serilog for request logging

    app.UseResponseCompression();

    app.UseAcontplusExceptionHandling();

    app.UseRouting();

    app.UseHttpsRedirection();

    // Improved CORS Configuration
    app.UseCors(corsPolicy);

    // Authentication and Authorization (adapt to your specific needs)
    app.UseAuthentication();

    app.UseAuthorization();

    // Map health check endpoints (before Ocelot to avoid auth requirements)
    app.MapHealthCheckEndpoints();

    // Default Route Redirect (consider a more elegant solution)
    app.UseEndpoints(_ => { });

    // Ocelot Integration
    app.UseOcelot().Wait();

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
