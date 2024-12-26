using Autofac.Extensions.DependencyInjection;
using Common.AppSettings;
using Reports.API.Extensions;
using Services.Common.Middleware;
using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.SetBasePath(DirectoryHelper.GetRuntimeDirectory());
ConfigurationHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

builder.Services.AddVersioningAndSwagger();

builder.Services.AddOpenApi();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

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
