using Common.AppSettings;
using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<MobileRequestMiddleware>();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5003"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseSwaggerDocumentation();

app.UseRouting();

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
