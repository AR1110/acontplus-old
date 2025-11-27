using Acontplus.Infrastructure.Extensions;
using Configuration.Api.Endpoints;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
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

  builder.Services.AddConfigurationServices(builder.Configuration);

  builder.Services.AddInfrastructureHealthChecks();

  var app = builder.Build();

  app.UseSerilogRequestLogging();

  if (app.Environment.IsDevelopment()) app.MapOpenApi();

  app.UseApplicationMiddleware(builder.Environment);

  app.MapAllEndpoints();

  app.UseRouting();

  app.UseHttpsRedirection();

  app.UseForwardedHeaders();

  app.UseAuthentication();

  app.UseAuthorization();

  app.MapControllers().RequireAuthorization();

  app.MapHealthCheckEndpoints();

  //using var scope = app.Services.CreateScope();
  //var services = scope.ServiceProvider;
  //var context = services.GetRequiredService<ConfigContext>();
  //var logger = services.GetRequiredService<ILogger<Program>>();

  //try
  //{
  //    await context.Database.MigrateAsync();
  //    await ConfigContextSeed.SeedAsync(context);
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
