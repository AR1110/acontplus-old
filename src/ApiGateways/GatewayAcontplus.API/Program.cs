using System.Reflection;
using Lib.Common;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Services.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string _MyCors = "MyCors";

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

//string[] origins = builder.Configuration.GetSection("SafeOrigins").Value.Split('|');


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: _MyCors, builder =>
    {
        //for when you're running on localhost
        //builder.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
        //.AllowAnyHeader().AllowAnyMethod();


        //builder.WithOrigins("url from where you're trying to do the requests")

        builder.AllowAnyOrigin()
   //.SetIsOriginAllowedToAllowWildcardSubdomains()
   .AllowAnyHeader()
   //.AllowCredentials()
   .AllowAnyMethod()
   .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
   .WithExposedHeaders("Content-Disposition")
   .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));

    });
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

builder.Services.AddCustomJwtAuthentication(builder.Configuration);


var app = builder.Build();

app.UseRouting();

app.UseHttpsRedirection();

//app.UseCors(builder =>
//{
//    builder.WithOrigins(origins)
//    .SetIsOriginAllowedToAllowWildcardSubdomains()
//    .AllowAnyHeader()
//    .AllowCredentials()
//    .AllowAnyMethod()
//    .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
//    .WithExposedHeaders("Content-Disposition")
//    .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
//});

app.UseCors(_MyCors);

app.UseAuthentication();

app.UseAuthorization();

//

app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", async context =>
    {
        string projectName = Assembly.GetExecutingAssembly().FullName.Split(',')[0];
        await context.Response.WriteAsync($"{projectName} is running at {string.Join(", ", app.Urls)}");
    });
});

app.MapControllers();

app.UseOcelot().Wait();

app.Run();
