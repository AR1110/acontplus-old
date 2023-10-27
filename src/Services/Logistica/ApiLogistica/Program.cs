using Common.Core.Utils;
using Services.Common;
using Services.Common.Logs;

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

            builder.Services.AddSingleton<LogWriter>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwaggerDocumentation();

            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
                       {
                           endpoints.MapGet("/", context =>
                           {
                               context.Response.Redirect("swagger");
                               return Task.CompletedTask;
                           });
                       });

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}
