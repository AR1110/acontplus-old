using System.Runtime.InteropServices;
using Autofac.Extensions.DependencyInjection;
using FactElect.API.Extensions;
using Services.Common.Configuration;
using Services.Common.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();

builder.Services.AddScoped<ICustomLogger, CustomLogger>();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseMiddleware<MobileRequestMiddleware>();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5006"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

app.Run();
