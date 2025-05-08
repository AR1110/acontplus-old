using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);
// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

builder.Services.AddVersioningAndSwagger();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerAndVersioning();
    app.MapOpenApi();
}

app.UseResponseCompression();

app.UseMiddleware<ExceptionMiddleware>();

app.UseMiddleware<MobileRequestMiddleware>();

app.UseRouting();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && !builder.Environment.IsProduction())
{
    app.Urls.Add("http://*:5007"); // Linux Port
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
