using Acontplus.Infrastructure.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Restaurant.Api.Endpoints;
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
    loggerConfiguration.ReadFrom.Configuration(hostContext.Configuration)
          .ReadFrom.Services(services);
    loggerConfiguration.ConfigureAdvancedLogger(hostContext.Configuration, environment);
  });

  const string corsPolicy = "RestaurantCorsPolicy";

  var safeOrigins = builder.Configuration.GetSection("AllowedCorsOrigins").Get<string>().Split(",");

  // Use AppConfiguration for loading settings
  var configuration = ApplicationConfigurationBuilder.Load();
  builder.Configuration.AddConfiguration(configuration);

  builder.Services.AddRestaurantServices(builder.Configuration);

  builder.Services.AddInfrastructureHealthChecks();

  builder.Services.AddCors(options =>
  {
    options.AddPolicy(corsPolicy, policy =>
      {
        policy.WithOrigins(safeOrigins)
              .SetIsOriginAllowed(_ => true)
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowCredentials()
              .AllowAnyHeader()
              .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
              .WithExposedHeaders("Content-Disposition")
              .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
      });
  });

  var app = builder.Build();

  if (app.Environment.IsDevelopment()) app.MapOpenApi();

  app.UseSerilogRequestLogging();

  app.UseResponseCompression();



  app.UseApplicationMiddleware(builder.Environment);

  app.UseHttpsRedirection();

  app.UseCors(corsPolicy);

  app.UseRouting();

  app.UseAuthentication();

  app.UseAuthorization();

  app.MapAllEndpoints();

  app.MapControllers().RequireAuthorization();

  app.MapHealthCheckEndpoints();

  app.UseStaticFiles();

  app.UseDefaultFiles();

  app.MapFallbackToFile("/index.html");

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
