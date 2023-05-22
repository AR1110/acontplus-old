using BL.JwtAuthenticationManger;
using Helpers;
using System.Reflection;

namespace ApiConfig
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddCustomJwtAuthentication();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            string[] origins = builder.Configuration.GetSection("SafeOrigins").Value.Split('|');
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    policy =>
                    {
                        policy.AllowAnyHeader();
                        policy.AllowAnyMethod();
                        policy.WithOrigins(origins);
                    });
            });

            var app = builder.Build();


            app.UseRouting();

            app.UseCors();

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