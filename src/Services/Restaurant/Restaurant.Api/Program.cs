using Common.Services.Middleware;

var builder = WebApplication.CreateBuilder(args);

const string corsPolicy = "RestaurantCorsPolicy";

var safeOrigins = builder.Configuration.GetSection("AllowedCorsOrigins").Get<string>().Split(",");

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins(safeOrigins)
            .SetIsOriginAllowed(_ => true)
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowCredentials()
            .AllowAnyHeader()
            .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .WithExposedHeaders("Content-Disposition")
            .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors(corsPolicy);

app.UseResponseCompression();

app.UseStatusCodePages();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers().RequireAuthorization();

app.UseStaticFiles();

app.UseDefaultFiles();

app.MapFallbackToFile("/index.html");

// using var scope = app.Services.CreateScope();
// var services = scope.ServiceProvider;
// var context = services.GetRequiredService<RestaurantContext>();
// try
// {
//     await context.Database.MigrateAsync();
//     await RestaurantContextSeed.SeedAsync(context);
// }
// catch (Exception ex)
// {
//     Console.WriteLine($"An error occured during migration: {ex.Message}");
// }

await app.RunAsync();
