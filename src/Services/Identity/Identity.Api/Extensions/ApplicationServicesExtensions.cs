using Acontplus.Services.Extensions;

namespace Identity.Api.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddIdentityServices(this IServiceCollection services,
      IConfiguration configuration)
  {

    services.AddApplicationServices(configuration);

    services.AddAdvancedLoggingOptions(configuration);

    services.AddJwtAuthentication(configuration);

    services.AddOpenApi();

    services.AddHttpContextAccessor();

    services.AddApiVersioningAndDocumentation();

    JsonConfigurationService.ConfigureAspNetCore(services, false);

    JsonConfigurationService.RegisterJsonConfiguration(services);

    services.AddDbContextPool<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

    // Add ASP.NET Core Identity
    services.AddIdentity<AppUser, AppRole>(options =>
    {
      // Password settings
      options.Password.RequireDigit = true;
      options.Password.RequiredLength = 8;
      options.Password.RequireNonAlphanumeric = false;
      options.Password.RequireUppercase = true;
      options.Password.RequireLowercase = true;
      options.Password.RequiredUniqueChars = 4;

      // Lockout settings
      options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
      options.Lockout.MaxFailedAccessAttempts = 5;
      options.Lockout.AllowedForNewUsers = true;

      // User settings
      options.User.RequireUniqueEmail = true;
      options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";

      // SignIn settings
      options.SignIn.RequireConfirmedEmail = false;
      options.SignIn.RequireConfirmedPhoneNumber = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

    services.AddHostedService<TokenCleanupAndArchivalService>();
    services.AddLookupService();
    services.AddScoped<IAccountService, AccountService>();
    services.AddScoped<IAdoRepository, AdoRepository>();
    services.AddScoped<ILoginFailedService, LoginFailedService>();
    services.AddScoped<ILoginHistoryService, LoginHistoryService>();
    services.AddScoped<IJwtTokenService, JwtTokenService>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IRefreshTokenService, RefreshTokenService>();

    return services;
  }
}
