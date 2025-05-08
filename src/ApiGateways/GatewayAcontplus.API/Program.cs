using System.Runtime.InteropServices;
using Common.Logging;
using Common.Services.Configuration;
using Common.Services.Extensions;
using Common.Services.Middleware;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAdvancedLogging(builder.Configuration);

// Environment and Configuration Setup
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBufferSize = 1048576;
    serverOptions.Limits.MaxRequestLineSize = 1048576;
});

const string corsPolicy = "OcelotCorsPolicy";

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Secure Environment Variable Retrieval (consider secret management for sensitive data)
var safeOrigins = builder.Configuration.GetSection("SafeOrigins").Get<string>().Split(",");

// Ocelot Configuration (consider using environment variables for dynamic configuration)
builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);

builder.Services.AddOcelot();

// Identity Services (adapt to your specific authentication mechanism)
builder.Services.AddIdentityService(builder.Configuration);

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

builder.Services
               .AddHealthChecks()
               .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Optimal;
});
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Optimal;
});

var app = builder.Build();

// Handle Port Configuration for Different Environments (consider a configuration or environment variable)
if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && !builder.Environment.IsProduction())
{
    app.Urls.Add("http://*:5001"); // Linux Port
}

app.UseResponseCompression();

//app.UseMiddleware<RequestCountingMiddleware>();

app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

app.UseHttpsRedirection();

// Improved CORS Configuration
app.UseCors(corsPolicy);

// Authentication and Authorization (adapt to your specific needs)
app.UseAuthentication();
app.UseAuthorization();

// Default Route Redirect (consider a more elegant solution)
app.UseEndpoints(_ => { });

// Map health check endpoints
app.MapHealthChecks("/hc", new HealthCheckOptions()
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
});

app.MapHealthChecks("/liveness", new HealthCheckOptions
{
    Predicate = r => r.Name.Contains("self")
});

// Ocelot Integration
app.UseOcelot().Wait();

await app.RunAsync();
