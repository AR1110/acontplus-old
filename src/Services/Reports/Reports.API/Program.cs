using Autofac.Extensions.DependencyInjection;
using Common.AppSettings;
using Reports.API.Extensions;
using Services.Common.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

builder.Services.AddApiVersioningConfig();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

var app = builder.Build();

app.UseMiddleware<ConnStrRequestMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();

app.UseSwaggerVersionedDocumentation();

app.UseRouting();


if (Environment.OSVersion.Platform != PlatformID.Win32NT)
{
    app.Urls.Add("http://*:5010"); // Linux Port
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

await app.RunAsync();
