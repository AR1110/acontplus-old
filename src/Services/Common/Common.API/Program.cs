
using Common.Core.Utils;
using Services.Common;
using Common.API.Extensions;
using Autofac.Extensions.DependencyInjection;
using Autofac;
using Newtonsoft.Json.Serialization;

namespace Common.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            // Add services to the container.
            builder.Services.AddApplicationServices(builder.Configuration);
            builder.Services.AddControllers()
                            .AddNewtonsoftJson(x =>
                            {
                                x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                                x.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                            });

            builder.Services.AddCustomJwtAuthentication(builder.Configuration);

            builder.Services.AddSwaggerDocumentation();

            builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
            builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

            var app = builder.Build(); 

            app.UseSwaggerDocumentation();

            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}
