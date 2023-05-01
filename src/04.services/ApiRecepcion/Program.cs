using BL.JwtAuthenticationManger;
using BL.Recepcion;
using Helpers;

namespace ApiRecepcion
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCustomJwtAuthentication();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            //builder.Services.AddTransient<IConfiguration>(config =>
            //{
            //    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            //    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
            //    return configurationBuilder.Build();

            //});

            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddScoped<FileTxt>();

            var app = builder.Build();
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            //app.UseCors();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMiddleware<JWTMiddleware>();

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}