using Lib.Common;
using Services.Common;
using Services.Common.Logs;

namespace testWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            //dynamic origins
            string[] origins = builder.Configuration.GetSection("SafeOrigins").Value.Split('|');
            //for mor information https://docs.microsoft.com/en-us/aspnet/core/mvc/views/view-compilation?view=aspnetcore-6.0&tabs=visual-studio

            //var mvcBuilder = builder.Services.AddRazorPages();
            //if (builder.Environment.IsDevelopment())
            //{
            //    mvcBuilder.AddRazorRuntimeCompilation();
            //}
            builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
            ConfigHelper.AddJsonFiles(builder.Configuration);

            builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();

            builder.Services.AddCustomJwtAuthentication(builder.Configuration);

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

            // Add services to the container.
            builder.Services.AddRazorPages().AddRazorRuntimeCompilation();
            //SignalR
            //builder.Services.AddSignalR();

            builder.Services.AddDistributedMemoryCache();

            builder.Services.AddMvc();

            //prevenir ataques
            //builder.Services.AddAntiforgery(options =>
            //{
            //    options.Cookie.SameSite = SameSiteMode.Strict;
            //    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            //    options.Cookie.HttpOnly = true;
            //});

            //builder.Services.AddScoped<CustomCookieAuthenticationEvents>();

            //builder.Services.AddHttpContextAccessor();

            builder.Services.AddSingleton<LogWriter>();

            var app = builder.Build();

            //cookies policy
            var cookiePolicyOptions = new CookiePolicyOptions
            {
                MinimumSameSitePolicy = SameSiteMode.Strict
            };

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

            app.UseCors();

            app.UseAuthentication(); //added manually

            app.UseAuthorization();

            //app.UseCookiePolicy(cookiePolicyOptions);

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            //app.MapHub<NotificationHub>("/notificationHub");

            app.MapRazorPages(); //added manually

            app.Run();
        }
    }
}

