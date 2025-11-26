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

  builder.Services.AddVentasServices(builder.Configuration);

  var app = builder.Build();

  if (app.Environment.IsDevelopment()) app.MapOpenApi();

  app.UseSerilogRequestLogging();

  app.UseResponseCompression();



  app.UseApplicationMiddleware(builder.Environment);

  app.UseRouting();

  app.UseHttpsRedirection();

  app.UseAuthentication();

  app.UseAuthorization();

  app.MapControllers().RequireAuthorization();

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

