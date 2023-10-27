using Common.Core.Interfaces;
using Common.Core.Utils;
using Common.Reports.Services;
using Services.Common.Logs;
using Services.Common;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Reports.API.Extensions;

namespace Reports.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddApplicationServices(builder.Configuration);

            builder.Services.AddControllers();
            builder.Services.AddCustomJwtAuthentication(builder.Configuration);

            builder.Services.AddSwaggerDocumentation();

            builder.Services.AddSingleton<LogWriter>();

            builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
            builder.Host.ConfigureContainer<ContainerBuilder>(b => b.RegisterModule(new AutoFacModule()));

            var app = builder.Build();

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
