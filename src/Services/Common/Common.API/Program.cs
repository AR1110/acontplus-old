using System.Runtime.InteropServices;

using Common.API.Data;
using Microsoft.EntityFrameworkCore;
using Services.Common.Configuration;
using Services.Common.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Add endpoints to the web application with minimal API's.
app.MapCommonEndpoints();

app.UseMiddleware<ExceptionMiddleware>();

app.UseMiddleware<MobileRequestMiddleware>();

app.UseRouting();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5002"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<CommonContext>();
var logger = services.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await CommonContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occured during migration");
}

await app.RunAsync();
