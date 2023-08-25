using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Restaurant.API.Extensions;
using Restaurant.Infrastructure.Data;
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

        app.MapControllers().RequireAuthorization();

        app.MapFallbackToFile("index.html");

        //using var scope = app.Services.CreateScope();
        //var services = scope.ServiceProvider;
        //var context = services.GetRequiredService<RestaurantContext>();
        //var logger = services.GetRequiredService<ILogger<Program>>();

        //try
        //{
        //    await context.Database.MigrateAsync();
        //    await RestaurantContextSeed.SeedAsync(context);
        //}
        //catch (Exception ex)
        //{
        //    logger.LogError(ex, "An error occured during migration");
        //}


        await app.RunAsync();
    }
}
