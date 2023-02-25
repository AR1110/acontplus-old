using WebUI.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using WebUI.Hubs;
using Microsoft.Extensions.DependencyInjection;

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
            builder.Services.AddControllersWithViews();
            builder.Services.AddRazorPages().AddRazorRuntimeCompilation();
            //SignalR
            builder.Services.AddSignalR();


            builder.Services.AddDistributedMemoryCache();

            builder.Services.AddMvc();

            //autenticacion global //https://learn.microsoft.com/en-us/aspnet/core/security/authorization/secure-data?view=aspnetcore-6.0
            builder.Services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
            });

            //for more information review https://docs.microsoft.com/en-us/aspnet/core/security/authentication/cookie?view=aspnetcore-6.0
            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                    options.SlidingExpiration = true;
                    options.LoginPath = "/Login/Index";
                    options.AccessDeniedPath = "/denied";
                    options.Events = new CookieAuthenticationEvents()
                    {
                        OnSigningIn = async context =>
                        {
                            //var principal = context.Principal;
                            //if (principal.HasClaim(c=>c.Type == ClaimTypes.NameIdentifier))
                            //{
                            //    if (principal.Claims.FirstOrDefault(c=>c.Type == ClaimTypes.NameIdentifier).Value=="root")
                            //    {
                            //        var claimsIdentity = principal.Identity as ClaimsIdentity;
                            //        claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, "Admin"));
                            //    }
                            //}
                            //context.Properties.ExpiresUtc = DateTimeOffset.Now.AddHours(1);
                            //context.CookieOptions.Expires = context.Properties.ExpiresUtc?.ToUniversalTime();
                            await Task.CompletedTask;
                        },
                        OnSignedIn = async context =>
                        {
                            await Task.CompletedTask;
                        },
                        OnValidatePrincipal = async context =>
                        {
                            await Task.CompletedTask;
                        }
                    };
                    options.EventsType = typeof(CustomCookieAuthenticationEvents);
                });

            //prevenir ataques
            builder.Services.AddAntiforgery(options =>
            {
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.HttpOnly = true;
            });

            builder.Services.AddScoped<CustomCookieAuthenticationEvents>();

            builder.Services.AddTransient<IConfiguration>(sp =>
            {
                IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                configurationBuilder.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
                return configurationBuilder.Build();
            });

            builder.Services.AddHttpContextAccessor();

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

            //app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();


            app.UseCors();

            app.UseAuthentication(); //added manually

            app.UseAuthorization();            


            app.UseCookiePolicy(cookiePolicyOptions);


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.MapHub<NotificationHub>("/notificationHub");
            app.MapRazorPages(); //added manually

            app.Run();
        }
    }
}

