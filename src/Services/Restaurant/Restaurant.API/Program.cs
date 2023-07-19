using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Extensions;
using Restaurant.Infrastructure.Data;
using Services.Common;
using Services.Common.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddCustomJwtAuthentication(builder.Configuration);
//builder.Services.Configure<IdentityOptions>(options =>
//{
//    options.Password.RequiredLength = 6;
//    options.Password.RequireUppercase = false;
//    options.Password.RequireLowercase = false;
//    options.Password.RequireDigit = false;
//    options.Password.RequireNonAlphanumeric = false;
//});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerDocumentation();

//builder.Services.AddCustomJwtAuthentication();

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
app.UseSwaggerDocumentation();

app.UseRouting();

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowCredentials();
    options.WithOrigins("https://localhost:7111");
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

//

app.MapControllers().RequireAuthorization();

app.MapFallbackToFile("index.html");


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<RestaurantContext>();
var logger = services.GetRequiredService<ILogger<Program>>();

try
{
    await context.Database.MigrateAsync();
    await RestaurantContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occured during migration");
}


await app.RunAsync();