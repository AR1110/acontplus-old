using System.Runtime.InteropServices;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Mechanical.API.Extensions;
using Services.Common.Configuration;
using Services.Common.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddCors();

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseStatusCodePages();

app.UseRouting();

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowCredentials();
    options.WithOrigins("https://localhost:7111");
});

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5009"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers().RequireAuthorization();

await app.RunAsync();
