using System.Runtime.InteropServices;


using Mechanical.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddCors();

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();

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

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && !builder.Environment.IsProduction())
{
    app.Urls.Add("http://*:5009"); // Linux Port
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers().RequireAuthorization();

await app.RunAsync();
