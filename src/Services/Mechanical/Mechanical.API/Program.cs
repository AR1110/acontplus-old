using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.AppSettings;
using Common.Core.Utils;
using Mechanical.API.Extensions;
using Newtonsoft.Json.Serialization;
using Services.Common.Extensions;
using System.Runtime.InteropServices;



internal class Program
{

    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.SetBasePath(DirectoryHelper.GetRuntimeDirectory());
        ConfigurationHelper.AddJsonFiles(builder.Configuration);

        // Add services to the container.
        builder.Services.AddApplicationServices(builder.Configuration);

        builder.Services.AddControllers()
                       .AddNewtonsoftJson(x =>
                       {
                           x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                           x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                       });

        builder.Services.AddCors();

        builder.Services.AddIdentityService(builder.Configuration);

        builder.Services.AddSwaggerDocumentation();

        builder.Services.AddScoped<ICustomLogger, CustomLogger>();

        builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

        var app = builder.Build();

        app.UseStatusCodePages();

        // Configure the HTTP request pipeline.
        app.UseSwaggerDocumentation();

        app.UseRouting();

        app.UseCors(options =>
        {
            options.AllowAnyHeader();
            options.AllowAnyMethod();
            options.AllowCredentials();
            options.WithOrigins("https://localhost:7111");
        });

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            app.Urls.Add("http://*:5009"); // Linux Port
        }
        else
        {
            app.UseHttpsRedirection();
        }

        app.UseAuthentication();

        app.UseAuthorization();

        app.UseStaticFiles();

        app.UseEndpoints(endpoints =>
        {
            _ = endpoints.MapGet("/", context =>
            {
                context.Response.Redirect("swagger");
                return Task.CompletedTask;
            });
        });

        app.MapControllers().RequireAuthorization();

        await app.RunAsync();
    }
}
