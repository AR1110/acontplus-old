using System.Runtime.InteropServices;
using Configuracion.API.Extensions.Endpoints;
using Services.Common.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseMiddleware<MobileRequestMiddleware>();

app.MapPrinterEndpoints();

app.UseRouting();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5004"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseForwardedHeaders();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

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
