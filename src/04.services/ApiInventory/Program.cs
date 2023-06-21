using ApiInventory.Extensions;
using BL.JwtAuthenticationManger;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Versioning;
using System.Reflection;

namespace ApiInventory
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
            builder.Services.AddSwaggerGen();

            //builder.Services.AddApiVersioning(options =>
            //{
            //    options.AssumeDefaultVersionWhenUnspecified = true;
            //    options.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);

            //    options.ApiVersionReader = ApiVersionReader.Combine(
            //        new QueryStringApiVersionReader("api-version"),
            //        new HeaderApiVersionReader("x-version"),
            //        new MediaTypeApiVersionReader("version")
            //        );
            //});

            builder.Services.AddApiVersioning(opt =>
            {
                opt.DefaultApiVersion = new ApiVersion(1, 0);
                opt.AssumeDefaultVersionWhenUnspecified = true;
                opt.ReportApiVersions = true;
                opt.ApiVersionReader = ApiVersionReader.Combine(new UrlSegmentApiVersionReader(),
                                                                new HeaderApiVersionReader("x-api-version"),
                                                                new MediaTypeApiVersionReader("x-api-version"));
            });

            builder.Services.AddVersionedApiExplorer(setup =>
            {
                setup.GroupNameFormat = "'v'VVV";
                setup.SubstituteApiVersionInUrl = true;
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();

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

            app.UseApiVersioning();

            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseCors();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMiddleware<JWTMiddleware>();

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapGet("/", async context =>
            //    {
            //        string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
            //        await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
            //    });
            //});

            app.MapControllers().RequireAuthorization();

            app.Run();
        }
    }
}