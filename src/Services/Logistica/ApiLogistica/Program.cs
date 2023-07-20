using Lib.Common;
using Services.Common;
using System.Reflection;

namespace ApiLogistica
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddControllers();

            builder.Services.AddCustomJwtAuthentication(builder.Configuration);

            builder.Services.AddSwaggerDocumentation();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwaggerDocumentation();

            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
                    //await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
                    context.Response.Redirect("swagger");
                });
            });

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}