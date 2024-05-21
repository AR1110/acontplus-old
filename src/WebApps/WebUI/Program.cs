using WebUI.Hubs;

var builder = WebApplication.CreateBuilder(args); 


builder.Services.AddRazorPages().AddRazorPagesOptions(options =>
{
    //options.RootDirectory = "/Pages";
    options.Conventions.AddPageRoute("/Home/Index", "");
    //options.Conventions.AddAreaPageRoute("Manage", "/Admin/AdminIndex", "login");
}
).AddRazorRuntimeCompilation();

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (Environment.OSVersion.Platform == PlatformID.Win32NT)
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
