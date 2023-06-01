using BL.JwtAuthenticationManger;
using Helpers;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//custom jwt
builder.Services.AddCustomJwtAuthentication();

builder.Services.AddTransient<IConfiguration>(sp =>
{
    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
    return configurationBuilder.Build();
});

string[] origins = builder.Configuration.GetSection("SafeOrigins").Value.Split('|');

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();

app.UseCors(policy =>
{
    policy.AllowCredentials();
    policy.WithExposedHeaders("Content-Disposition");
    policy.AllowAnyHeader();
    policy.AllowAnyMethod();
    policy.WithOrigins(origins);
});

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

app.MapControllers();

app.Run();
