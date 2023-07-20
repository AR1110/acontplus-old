using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Middleware;
using System.Reflection;
using System.Text.Json;
using Vet.API.Extensions;
using Vet.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
                .AddNewtonsoftJson(x =>
                {
                    x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                }
                 )
                .AddJsonOptions(options =>
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddCustomJwtAuthentication(builder.Configuration);
builder.Services.AddSwaggerDocumentation();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
app.UseSwaggerDocumentation();

app.UseRouting();

app.UseHttpsRedirection();

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

//using var scope = app.Services.CreateScope();
//var services = scope.ServiceProvider;
//var context = services.GetRequiredService<VetContext>();
//var logger = services.GetRequiredService<ILogger<Program>>();
//try
//{
//    await context.Database.MigrateAsync();
//    await VetContextSeed.SeedAsync(context);
//}
//catch (Exception ex)
//{
//    logger.LogError(ex, "An error occured during migration");
//}

await app.RunAsync();
