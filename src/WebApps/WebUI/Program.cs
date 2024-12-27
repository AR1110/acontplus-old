using System.Runtime.InteropServices;
using WebUI.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages().AddRazorRuntimeCompilation();

builder.Services.AddSignalR();

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

app.UseAuthentication();

app.UseAuthorization();

app.MapHub<NotificationHub>("/notificationHub");

app.MapRazorPages();

app.Run();
