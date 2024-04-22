using Autofac;
using Autofac.Extensions.DependencyInjection;
using Common.Core.Utils;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Restaurant.API.Data;
using Restaurant.API.Extensions;
using Services.Common.Extensions;


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

        builder.Services.AddIdentityService(builder.Configuration);

        builder.Services.AddSwaggerDocumentation();

        builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));


        var app = builder.Build();

        if (Environment.OSVersion.Platform != PlatformID.Win32NT)
        {
            app.Urls.Add("http://*:5011"); // 👈 Add the URL
        }
        else
        {
            app.UseHttpsRedirection();
        }

        app.UseStatusCodePages();

        // Configure the HTTP request pipeline.
        app.UseSwaggerDocumentation();

        app.UseRouting();

        app.UseAuthentication();

        app.UseAuthorization();

        app.UseStaticFiles();

        app.MapControllers().RequireAuthorization();

        app.MapFallbackToFile("index.html");

        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<RestaurantContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
            await context.Database.MigrateAsync();
            await RestaurantContextSeed.SeedAsync(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occured during migration");
        }


        await app.RunAsync();
    }
}
