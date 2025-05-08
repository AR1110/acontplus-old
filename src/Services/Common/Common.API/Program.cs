using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && !builder.Environment.IsProduction())
{
    app.Urls.Add("http://*:5002"); // Linux Port
}

app.UseResponseCompression();

app.UseMiddleware<ExceptionMiddleware>();

app.UseMiddleware<MobileRequestMiddleware>();

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

// Add endpoints to the web application with minimal API's.
app.MapCommonEndpoints();

//using var scope = app.Services.CreateScope();
//var services = scope.ServiceProvider;
//var context = services.GetRequiredService<CommonContext>();
//var logger = services.GetRequiredService<ILogger<Program>>();
//try
//{
//    await context.Database.MigrateAsync();
//    await CommonContextSeed.SeedAsync(context);
//}
//catch (Exception ex)
//{
//    logger.LogError(ex, "An error occured during migration");
//}

await app.RunAsync();
