using System.Reflection;
using Compras.Application;
using Lib.Common;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Logs;
namespace ApiRecepcion
{
    public class Program
    {
        public static void Main(string[] args)
        {
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

            builder.Services.AddCustomJwtAuthentication(builder.Configuration);

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddSwaggerDocumentation();

            //builder.Services.AddTransient<IConfiguration>(config =>
            //{
            //    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            //    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
            //    return configurationBuilder.Build();

            //});



            builder.Services.AddScoped<FileTxt>();
            builder.Services.AddSingleton<LogWriter>();

            var app = builder.Build();

            app.UseHttpsRedirection();

            app.UseSwaggerDocumentation();

            app.UseRouting();

            //app.UseCors();

            app.UseAuthentication();

            app.UseAuthorization();



            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapGet("/", async context =>
            //    {
            //        string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
            //        //await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
            //        context.Response.Redirect("swagger");
            //    });
            //});

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}
