using System.Runtime.InteropServices;
using Common.Services.Middleware;
using Mechanical.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && !builder.Environment.IsProduction())
{
    app.Urls.Add("http://*:5009"); // Linux Port
}

app.UseResponseCompression();

app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

await app.RunAsync();
