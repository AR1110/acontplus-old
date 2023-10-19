using Autofac.Extensions.DependencyInjection;
using Autofac;
using Lib.Common;
using Mechanical.API.Extensions;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Logs;
using Services.Common.Middleware;

internal class Program
{

    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
        ConfigHelper.AddJsonFiles(builder.Configuration);

        // Add services to the container.
        builder.Services.AddApplicationServices(builder.Configuration);

        builder.Services.AddControllers()
                       .AddNewtonsoftJson(x =>
                       {
                           x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                           x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                       });

        builder.Services.AddCors();

        builder.Services.AddCustomJwtAuthentication(builder.Configuration);

        builder.Services.AddSwaggerDocumentation();

        builder.Services.AddSingleton<LogWriter>();

        builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

        var app = builder.Build();

        app.UseMiddleware<ExceptionMiddleware>();

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

        app.UseHttpsRedirection();

        app.UseAuthentication();

        app.UseAuthorization();

        app.UseStaticFiles();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapGet("/", context =>
            {
                context.Response.Redirect("swagger");
                return Task.CompletedTask;
            });
        });

        app.MapControllers().RequireAuthorization();

        await app.RunAsync();
    }
}
