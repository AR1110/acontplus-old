using System.Runtime.InteropServices;
using Common.Logging;
using Microsoft.AspNetCore.Http.Features;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddAdvancedLogging(builder.Configuration);

builder.Services.AddHttpClient("ApiProxy", client =>
{
    // Aumentar el timeout para solicitudes grandes
    client.Timeout = TimeSpan.FromMinutes(10);
});

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

if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseRouting();

app.Use(async (context, next) =>
{
    // Para solicitudes PUT
    if (context.Request.Method == HttpMethods.Put)
    {
        var queryLength = context.Request.QueryString.Value?.Length ?? 0;

        // Log para query strings grandes
        if (queryLength > 2000)
        {
            Log.Warning("Solicitud PUT con query string largo: {Length} caracteres", queryLength);

            // Habilitar buffering para asegurar que se pueda leer el cuerpo varias veces
            context.Request.EnableBuffering();
        }
    }

    await next();
});

app.UseAuthentication();

app.UseAuthorization();


app.MapRazorPages();


await app.RunAsync();
