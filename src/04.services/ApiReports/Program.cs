using BL.JwtAuthenticationManger;
using BL.Reports;
using Helpers;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCustomJwtAuthentication();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//builder.Services.AddTransient<IConfiguration>(config =>
//{
//    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
//    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
//    return configurationBuilder.Build();

//});
builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddSingleton<Reports>();

var app = builder.Build();

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<JWTMiddleware>();

app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", async context =>
    {
        string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
        await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
    });
});

app.MapControllers().RequireAuthorization();

app.Run();
