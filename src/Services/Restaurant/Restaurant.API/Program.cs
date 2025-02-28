var builder = WebApplication.CreateBuilder(args);

// Use AppConfiguration for loading settings
var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);


// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddOpenApi();


builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Fastest;
});
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.SmallestSize;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
{
    app.Urls.Add("http://*:5011"); // Linux Port
}
else
{
    app.UseHttpsRedirection();
}

app.UseResponseCompression();

app.UseStatusCodePages();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers().RequireAuthorization();

app.MapFallbackToFile("index.html");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<RestaurantContext>();
try
{
    await context.Database.MigrateAsync();
    await RestaurantContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine($"An error occured during migration: {ex.Message}");
}


await app.RunAsync();
