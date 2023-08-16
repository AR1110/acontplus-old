using ApiContabilidad.Extensions;
using Lib.Common;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Logs;

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

builder.Services.AddSwaggerDocumentation();

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

builder.Services.AddSingleton<LogWriter>();

var app = builder.Build();

app.UseSwaggerDocumentation();

app.UseRouting();

app.UseHttpsRedirection();

app.UseCors();

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
