using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.AppSettings;
using GatewayAcontplus.API.Data;
using GatewayAcontplus.API.Delegates;
//using GatewayAcontplus.API.Middleware;
//using GatewayAcontplus.API.Services;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Services.Common.Extensions;
using Services.Common.Middleware;
using System.Runtime.InteropServices;


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

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//        options.UseSqlServer(builder.Configuration.GetConnectionString("OcelotGateway")));

//builder.Services.AddSingleton<IMessageQueueService, RabbitMQService>();
//builder.Services.AddHostedService<RequestConsumerService>();

// Ocelot Configuration (consider using environment variables for dynamic configuration)
builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory()).ConfigureContainer<ContainerBuilder>(builder =>
{
    // Register the ReportHeaderDelegatingHandler
    builder.RegisterType<ConnectionStringHeaderDelegatingHandler>()
        .InstancePerLifetimeScope();

    // Register any other dependencies here
});
builder.Services.AddOcelot().AddDelegatingHandler<ConnectionStringHeaderDelegatingHandler>();

// Identity Services (adapt to your specific authentication mechanism)
builder.Services.AddIdentityService(builder.Configuration);

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

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Fastest;
});
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.SmallestSize;
});

var app = builder.Build();

app.UseResponseCompression();

//app.UseMiddleware<RequestCountingMiddleware>();

app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

// Handle Port Configuration for Different Environments (consider a configuration or environment variable)
if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
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
