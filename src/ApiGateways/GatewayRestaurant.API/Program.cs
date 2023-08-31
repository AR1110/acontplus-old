using System.Reflection;
using Lib.Common;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Services.Common;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

// Add services to the container.
string[] origins = builder.Configuration.GetSection("SafeOrigins").Value.Split('|');

builder.Services.AddControllers();
builder.Services.AddCors();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();


builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

builder.Services.AddCustomJwtAuthentication(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
    .SetIsOriginAllowedToAllowWildcardSubdomains()
    .AllowAnyHeader()
    //.AllowCredentials()
    .AllowAnyMethod()
    .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
    .WithExposedHeaders("Content-Disposition")
    .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
});

app.UseAuthentication();

app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", async context =>
    {
        string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
        await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
    });
});


app.MapControllers();

app.UseOcelot().Wait();

app.Run();
