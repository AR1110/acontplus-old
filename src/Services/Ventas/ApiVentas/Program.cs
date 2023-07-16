using Services.Common;
using Helpers;
using System.Reflection;

namespace ApiVentas
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


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddSwaggerDocumentation();


            var app = builder.Build();

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