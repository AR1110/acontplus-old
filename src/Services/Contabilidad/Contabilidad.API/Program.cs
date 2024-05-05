using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.Core.Utils;
using Contabilidad.API.Extensions;
using Newtonsoft.Json.Serialization;
using Services.Common.Extensions;
using Services.Common.Logs;

namespace Contabilidad.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddApplicationServices(builder.Configuration);

            builder.Services.AddControllers()
                            .AddNewtonsoftJson(x =>
                            {
                                x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                                x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                            });

            builder.Services.AddIdentityService(builder.Configuration);

            builder.Services.AddSwaggerDocumentation();

            builder.Services.AddApiVersioningConfig();

            builder.Services.AddScoped<ICustomLogger, CustomLogger>();

            builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
            builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

            var app = builder.Build();

            app.UseSwaggerVersionedDocumentation();

            if (Environment.OSVersion.Platform != PlatformID.Win32NT)
            {
                app.Urls.Add("http://*:5005"); // Linux Port
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                _ = endpoints.MapGet("/", context =>
                {
                    context.Response.Redirect("swagger");
                    return Task.CompletedTask;
                });
            });

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}
