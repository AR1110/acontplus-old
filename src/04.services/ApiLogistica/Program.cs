using Helpers;
using BL.JwtAuthenticationManger;
using System.Reflection;

namespace ApiLogistica
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddCustomJwtAuthentication();

            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMiddleware<JWTMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
                    await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
                });
            });

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}