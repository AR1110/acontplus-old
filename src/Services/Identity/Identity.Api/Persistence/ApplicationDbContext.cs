using System.Reflection;

namespace Identity.Api.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : BaseContext(options)
{
    // Identity entities - DbSets for querying only, excluded from migrations
    public DbSet<AppUser> Users { get; set; }
    public DbSet<AppRole> AppRoles { get; set; }
    public DbSet<AppUserRole> UserRoles { get; set; }

    // Custom entities
    public DbSet<ForgotPassword> ForgotPasswords { get; set; }
    public DbSet<LoginHistory> LoginHistories { get; set; }
    public DbSet<LoginHistoryArchive> LoginHistoryArchives { get; set; }
    public DbSet<LoginFailed> LoginFaileds { get; set; }
    public DbSet<AccessAuthorization> AccessAuthorizations { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Actions> Actions { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<LicenseAccesses> LicenseAccesses { get; set; }
    public DbSet<LicenseAccessDetails> LicenseAccessDetails { get; set; }
    public DbSet<PolicyType> PolicyTypes { get; set; }
    public DbSet<PolicyConfigurationAudit> PolicyConfigurationAudits { get; set; }
    public DbSet<PolicyEnforcementLog> PolicyEnforcementLogs { get; set; }
    public DbSet<FeaturePolicyAccess> FeaturePolicyAccesses { get; set; }
    public DbSet<PricingPlanAccess> PricingPlanAccesses { get; set; }
    public DbSet<PricingPlanAccessDetail> PricingPlanAccessDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Exclude Identity entities from migrations - they are managed manually
        modelBuilder.Entity<AppUser>().ToTable("Users", "Auth", t => t.ExcludeFromMigrations());
        modelBuilder.Entity<AppRole>().ToTable("Roles", "Auth", t => t.ExcludeFromMigrations());
        modelBuilder.Entity<AppUserRole>().ToTable("UserRoles", "Auth", t => t.ExcludeFromMigrations());

        // Apply all entity configurations from the current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Global configurations for performance optimization
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) && p.GetColumnType() == null))
            property.SetIsUnicode(false);
    }
}
