using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.Core.Utils;
using Inventario.API.Extensions;
using Newtonsoft.Json.Serialization;
using Services.Common.Extensions;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.WebHost.ConfigureKestrel(serverOptions =>
        {
            serverOptions.Limits.MaxRequestBufferSize = 1048576;
            serverOptions.Limits.MaxRequestLineSize = 1048576;
        });

        builder.Services.AddControllers()
                        .AddNewtonsoftJson(x =>
                        {
                            x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                            x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                        });

        builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
        ConfigHelper.AddJsonFiles(builder.Configuration);

        builder.Services.AddApplicationServices(builder.Configuration);

        builder.Services.AddIdentityService(builder.Configuration);

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddSwaggerDocumentation();

        builder.Services.AddApiVersioningConfig();

        builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

        var app = builder.Build();

        app.UseSwaggerVersionedDocumentation();

        app.UseRouting();

        if (Environment.OSVersion.Platform != PlatformID.Win32NT)
        {
            app.Urls.Add("http://*:5008"); // 👈 Add the URL
        }
        else
        {
            app.UseHttpsRedirection();
        }

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers().RequireAuthorization();

        app.UseEndpoints(endpoints =>
        {
            _ = endpoints.MapGet("/", context =>
            {
                context.Response.Redirect("swagger");
                return Task.CompletedTask;
            });
        });


        app.Run();
    }
}
