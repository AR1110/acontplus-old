using Compras.Application;
using Lib.Common;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Logs;

namespace Compras.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddControllers()
                          .AddNewtonsoftJson(x =>
                          {
                              x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                              x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                          });

            builder.Services.AddCustomJwtAuthentication(builder.Configuration);

            builder.Services.AddSwaggerDocumentation();

            builder.Services.AddScoped<FileTxt>();
            builder.Services.AddSingleton<LogWriter>();

            var app = builder.Build();

            app.UseHttpsRedirection();

            app.UseSwaggerDocumentation();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}
