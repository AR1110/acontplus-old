using Autofac.Extensions.DependencyInjection;
using Common.Core.Utils;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Services.Common.Extensions;
using Services.Common.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Environment and Configuration Setup
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBufferSize = 1048576;
    serverOptions.Limits.MaxRequestLineSize = 1048576;
});

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

// Secure Environment Variable Retrieval (consider secret management for sensitive data)
var safeOrigins = builder.Configuration.GetSection("SafeOrigins").Get<string>().Split(",")
                   ?? throw new ArgumentException("SafeOrigins configuration is missing.");

// Ocelot Configuration (consider using environment variables for dynamic configuration)
builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

// Identity Services (adapt to your specific authentication mechanism)
builder.Services.AddIdentityService(builder.Configuration);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(safeOrigins)
            .SetIsOriginAllowed(isOriginAllowed: _ => true)
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowCredentials()
            .AllowAnyHeader()
            .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
            .WithExposedHeaders("Content-Disposition")
            .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
    });
});

builder.Services
               .AddHealthChecks()
               .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

builder.Services.AddScoped<ICustomLogger, CustomLogger>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

// Handle Port Configuration for Different Environments (consider a configuration or environment variable)
if (Environment.OSVersion.Platform != PlatformID.Win32NT)
{
    app.Urls.Add("http://*:5001"); // Linux Port
}
else
{
    // Consider configuring HTTPS redirection conditionally based on environment
    // or using a more robust certificate management strategy.
    app.UseHttpsRedirection();
}

// Improved CORS Configuration
app.UseCors("AllowAll"); // Use the configured policy

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
