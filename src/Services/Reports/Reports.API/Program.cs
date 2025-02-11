using System.Runtime.InteropServices;
using Common.Logging;
using Reports.API.Extensions;
using Services.Common.Configuration;
using Services.Common.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.

builder.Services.AddAdvancedLogging(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

builder.Services.AddVersioningAndSwagger();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerAndVersioning();
}

//app.UseMiddleware<ConnStrRequestMiddleware>();

app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5010"); // Linux Port
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

await app.RunAsync();
