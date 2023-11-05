using Common.Core.Utils;
using Services.Common;
using Services.Common.Logs;
using WebUI.Hubs;

namespace WebUI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //var mvcBuilder = builder.Services.AddRazorPages();
            //if (builder.Environment.IsDevelopment())
            //{
            //    mvcBuilder.AddRazorRuntimeCompilation();
            //}
            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddCustomJwtAuthentication(builder.Configuration);


            builder.Services.AddRazorPages().AddRazorPagesOptions(options =>
            {
                //options.RootDirectory = "/Pages";
                options.Conventions.AddPageRoute("/Home/Index", "");
                //options.Conventions.AddAreaPageRoute("Manage", "/Admin/AdminIndex", "login");
            }
            ).AddRazorRuntimeCompilation();

            builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();


            builder.Services.AddSignalR();

            //prevenir ataques
            //builder.Services.AddAntiforgery(options =>
            //{
            //    options.Cookie.SameSite = SameSiteMode.Strict;
            //    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            //    options.Cookie.HttpOnly = true;
            //}); +

            //builder.Services.AddHttpContextAccessor();

            builder.Services.AddSingleton<LogWriter>();

            var app = builder.Build();

            //cookies policy
            //var cookiePolicyOptions = new CookiePolicyOptions
            //{
            //    MinimumSameSitePolicy = SameSiteMode.Strict
            //};

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication(); //added manually

            app.UseAuthorization();

            //app.UseCookiePolicy(cookiePolicyOptions);

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapHub<NotificationHub>("/notificationHub");

            app.MapRazorPages(); //added manually

            app.Run();
        }
    }
}

