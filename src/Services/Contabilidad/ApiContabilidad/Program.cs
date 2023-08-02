using Services.Common;
using System.Reflection;
using Lib.Common;
using ApiContabilidad.Extensions;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddControllers()
                .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                });


builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddCustomJwtAuthentication(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerDocumentation();

//builder.Services.AddTransient<IConfiguration>(sp =>
//{
//    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
//    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
//    return configurationBuilder.Build();
//});

string[] origins = builder.Configuration.GetSection("SafeOrigins").Value.Split('|');
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.WithOrigins(origins);
        });
});

var app = builder.Build();

app.UseSwaggerDocumentation();

app.UseRouting();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();



app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", async context =>
    {
        string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
        //await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
        context.Response.Redirect("swagger");
    });
});

app.MapControllers().RequireAuthorization();

app.Run();
