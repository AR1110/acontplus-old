using Common.AppSettings;
using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(DirectoryHelper.GetRuntimeDirectory());
ConfigurationHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5012"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseStatusCodePages();

// Configure the HTTP request pipeline.
app.UseSwaggerDocumentation();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapGet("/", context =>
    {
        context.Response.Redirect("swagger");
        return Task.CompletedTask;
    });
});

app.MapControllers().RequireAuthorization();

//using var scope = app.Services.CreateScope();
//var services = scope.ServiceProvider;
//var context = services.GetRequiredService<TechnicalSupportContext>();
//var logger = services.GetRequiredService<ILogger<Program>>();

//try
//{
//    await context.Database.MigrateAsync();
//    await TechnicalSupportContextSeed.SeedAsync(context);
//}
//catch (Exception ex)
//{
//    logger.LogError(ex, "An error occured during migration");
//}

await app.RunAsync();
