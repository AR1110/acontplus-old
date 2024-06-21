using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.AppSettings;
using Newtonsoft.Json.Serialization;
using Services.Common.Middleware;
using Ventas.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerDocumentation();

builder.Services.AddApiVersioningConfig();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseSwaggerVersionedDocumentation();

app.UseRouting();

if (Environment.OSVersion.Platform != PlatformID.Win32NT)
{
    app.Urls.Add("http://*:5013"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();

app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapGet("/", context =>
    {
        context.Response.Redirect("swagger");
        return Task.CompletedTask;
    });
});

app.MapControllers().RequireAuthorization();

app.Run();
