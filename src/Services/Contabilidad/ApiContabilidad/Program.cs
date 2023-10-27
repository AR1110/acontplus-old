using ApiContabilidad.Extensions;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.Core.Utils;
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

builder.Services.AddSingleton<LogWriter>();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

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
