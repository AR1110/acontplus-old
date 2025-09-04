using Acontplus.Logging;
using Microsoft.AspNetCore.Http.Features;
using Serilog;

Log.Logger = new LoggerConfiguration()
           .WriteTo.Console()
           .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    var environment = builder.Environment.EnvironmentName;

    builder.Host.UseSerilog((hostContext, services, loggerConfiguration) =>
    {
        loggerConfiguration.ConfigureAdvancedLogger(hostContext.Configuration, environment);

        loggerConfiguration.ReadFrom.Configuration(hostContext.Configuration);
        loggerConfiguration.ReadFrom.Services(services);
    });

    builder.Services.AddAdvancedLoggingOptions(builder.Configuration);

    builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // 1. Aumentar el tamaño máximo del buffer de solicitudes (8MB)
    serverOptions.Limits.MaxRequestBufferSize = 8_388_608; // 8MB

    // 2. Aumentar el tamaño máximo de la línea de solicitud HTTP (8MB) - CRÍTICO para query strings largos
    serverOptions.Limits.MaxRequestLineSize = 8_388_608; // 8MB

    // 3. Aumentar el tamaño máximo de los headers (256KB)
    serverOptions.Limits.MaxRequestHeadersTotalSize = 262_144; // 256KB

    // 4. Configurar tiempos de espera más largos para solicitudes grandes
    serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(10);
    serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(2);

    // 5. Deshabilitar el límite de tamaño del cuerpo para solicitudes síncronas
    serverOptions.Limits.MaxRequestBodySize = null; // Sin límite
});

    builder.Services.AddAdvancedLoggingOptions(builder.Configuration);

    builder.Services.AddRazorPages().AddRazorRuntimeCompilation();

    builder.Services.Configure<FormOptions>(options =>
    {
        options.ValueLengthLimit = int.MaxValue;
        options.MultipartBodyLengthLimit = long.MaxValue;
        options.MultipartHeadersLengthLimit = int.MaxValue;
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        // Handle general exceptions
        app.UseExceptionHandler("/Error");

        // Handle 404 Not Found errors
        app.UseStatusCodePagesWithReExecute("/NotFound");

        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }


    app.UseHttpsRedirection();

    app.UseDefaultFiles();

    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapRazorPages();

    await app.RunAsync();
}
catch (Exception ex)
{
    // Catch any critical startup errors
    Log.Fatal(ex, "API host terminated unexpectedly.");
}
finally
{
    // Ensure all buffered logs are flushed on application shutdown
    Log.CloseAndFlush();
}
