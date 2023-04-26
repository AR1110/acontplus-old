using BL.JwtAuthenticationManger;
using Helpers;

namespace ApiFactElect
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

            //builder.Services.AddTransient<IConfiguration>(sp =>
            //{
            //    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            //    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
            //    return configurationBuilder.Build();
            //});

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

            //app.UseHttpsRedirection();
            app.UseCors();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMiddleware<JWTMiddleware>();

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}