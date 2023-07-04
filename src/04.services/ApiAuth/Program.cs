using BL.JwtAuthenticationManger;
using Helpers;
using System.Reflection;

namespace ApiAuth
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSingleton<JwtTokenHandler>();
            builder.Services.AddHttpContextAccessor();
            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            var app = builder.Build();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
                    await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
                });
            });

            app.MapControllers();


            app.Run();
        }
    }
}