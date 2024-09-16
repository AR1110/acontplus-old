using Autofac.Extensions.DependencyInjection;
using Common.AppSettings;
using FactElect.API.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Services.Common.Middleware;
using System.Runtime.InteropServices;

namespace FactElect.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
        ConfigHelper.AddJsonFiles(builder.Configuration);

        builder.Services.AddApplicationServices(builder.Configuration);

        builder.Services.AddControllers()
            .AddNewtonsoftJson(x =>
            {
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                x.SerializerSettings.ContractResolver =
                    new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
            });

        builder.Services.AddIdentityService(builder.Configuration);

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddSwaggerDocumentation();

        builder.Services.AddScoped<ICustomLogger, CustomLogger>();

        builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

        var app = builder.Build();

        app.UseMiddleware<ExceptionMiddleware>();

        app.UseMiddleware<MobileRequestMiddleware>();

        app.UseSwaggerDocumentation();

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            app.Urls.Add("http://*:5006"); // Linux Port
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
