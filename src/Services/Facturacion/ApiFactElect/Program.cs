using Services.Common;
using Helpers;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using ApiFactElect.Extensions;

namespace ApiFactElect
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

            builder.Services.AddApiVersioning(opt =>
            {
                opt.DefaultApiVersion = new ApiVersion(1, 0);
                opt.AssumeDefaultVersionWhenUnspecified = true;
                opt.ReportApiVersions = true;
                opt.ApiVersionReader = ApiVersionReader.Combine(new UrlSegmentApiVersionReader(),
                                                                new QueryStringApiVersionReader("api-version"),
                                                                new HeaderApiVersionReader("x-api-version"),
                                                                new MediaTypeApiVersionReader("x-api-version"));
            });

            builder.Services.AddVersionedApiExplorer(setup =>
            {
                setup.GroupNameFormat = "'v'VVV";
                setup.SubstituteApiVersionInUrl = true;
            });

            //builder.Services.AddTransient<IConfiguration>(sp =>
            //{
            //    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            //    configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
            //    return configurationBuilder.Build();
            //});

            builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();


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

            var apiVersionDescriptionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                foreach (var description in apiVersionDescriptionProvider.ApiVersionDescriptions)
                {
                    options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json",
                        description.GroupName.ToUpperInvariant());
                }
            });

            //app.UseSwaggerDocumentation();

            app.UseHttpsRedirection();

            app.UseApiVersioning();

            app.UseRouting();

            app.UseCors();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMiddleware<JWTMiddleware>();

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