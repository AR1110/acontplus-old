using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Identity.Api.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>(options)
{
    public DbSet<ForgotPassword> ForgotPasswords { get; set; }
    public DbSet<LoginHistory> LoginHistories { get; set; }
    public DbSet<LoginHistoryArchive> LoginHistoryArchives { get; set; }
    public DbSet<LoginFailed> LoginFaileds { get; set; }
    public DbSet<AccessAuthorization> AccessAuthorizations { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Actions> Actions { get; set; }
    public DbSet<Role> CustomRoles { get; set; }
    public DbSet<LicenseAccesses> LicenseAccesses { get; set; }
    public DbSet<LicenseAccessDetails> LicenseAccessDetails { get; set; }
    public DbSet<PolicyType> PolicyTypes { get; set; }
    public DbSet<PolicyConfigurationAudit> PolicyConfigurationAudits { get; set; }
    public DbSet<PolicyEnforcementLog> PolicyEnforcementLogs { get; set; }
    public DbSet<FeaturePolicyAccess> FeaturePolicyAccesses { get; set; }
    public DbSet<PricingPlanAccess> PricingPlanAccesses { get; set; }
    public DbSet<PricingPlanAccessDetail> PricingPlanAccessDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply all entity configurations from the current assembly
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Global configurations for performance optimization
        ConfigureDecimalToDoubleConversion(builder);
        ConfigureStringPropertiesToNonUnicode(builder);
        ConfigureIdentityTableNames(builder);
    }

    private static void ConfigureDecimalToDoubleConversion(ModelBuilder builder)
    {
        // Convert decimal properties to double for better performance in SQL Server
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var decimalProperties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(decimal) || p.PropertyType == typeof(decimal?));

            foreach (var property in decimalProperties)
            {
                builder.Entity(entityType.Name)
                    .Property(property.Name)
                    .HasConversion<double>();
            }
        }
    }

    private static void ConfigureStringPropertiesToNonUnicode(ModelBuilder builder)
    {
        // Force all string-based columns to non-unicode equivalent for better performance
        // when no column type is explicitly set
        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) && p.GetColumnType() == null))
        {
            property.SetIsUnicode(false);
        }
    }

    private static void ConfigureIdentityTableNames(ModelBuilder builder)
    {
        // Configure Identity table names and schemas for better organization
        // Using 'Auth' schema instead of 'Identity' to avoid SQL Server reserved word conflicts
        builder.Entity<AppUser>().ToTable("Users", "Auth");
        builder.Entity<AppRole>().ToTable("Roles", "Auth");
        builder.Entity<AppUserRole>().ToTable("UserRoles", "Auth");
        builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims", "Auth");
        builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins", "Auth");
        builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims", "Auth");
        builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens", "Auth");
    }
}
