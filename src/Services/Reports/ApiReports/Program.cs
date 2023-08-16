using Lib.Common;
using Reports.Application;
using Services.Common;
using Services.Common.Logs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddCustomJwtAuthentication(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

//builder.Services.AddTransient<IConfiguration>(config =>
//{
//    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
//    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
//    return configurationBuilder.Build();

//});

builder.Services.AddSingleton<ReportService>();

builder.Services.AddSwaggerDocumentation();

builder.Services.AddSingleton<LogWriter>();

var app = builder.Build();

app.UseSwaggerDocumentation();

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();



app.UseEndpoints(endpoints =>
           {
               endpoints.MapGet("/", context =>
               {
                   context.Response.Redirect("swagger");
                   return Task.CompletedTask;
               });
           });

app.MapControllers().RequireAuthorization();

app.Run();
