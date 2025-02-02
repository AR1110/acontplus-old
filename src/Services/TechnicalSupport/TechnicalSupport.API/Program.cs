using System.Runtime.InteropServices;
using Services.Common.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

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

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

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
