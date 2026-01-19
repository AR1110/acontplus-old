namespace Configuration.Infrastructure.Persistence;

public class ConfigurationContext(DbContextOptions<ConfigurationContext> options) : BaseContext(options)
{
    public DbSet<Printer> Printers { get; set; }
    public DbSet<PrinterDocument> PrinterDocuments { get; set; }
    public DbSet<PrinterType> PrinterTypes { get; set; }
    public DbSet<EstablecimientoLogo> EstablecimientoLogos { get; set; }
    public DbSet<Applications> Applications { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<CompanyDemoStep> CompanyDemoSteps { get; set; }
    public DbSet<CompanyPolicyOverride> CompanyPolicyOverrides { get; set; }
    public DbSet<Days> Days { get; set; }
    public DbSet<DemoStep> DemoSteps { get; set; }
    public DbSet<Ec2Instance> Ec2Instances { get; set; }
    public DbSet<LicenseDetails> LicenseDetails { get; set; }
    public DbSet<LicensePolicyConfiguration> LicensePolicyConfigurations { get; set; }
    public DbSet<Licenses> Licenses { get; set; }
    public DbSet<LicenseType> LicenseTypes { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<MenuAction> MenuActions { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<ScheduleCompany> ScheduleCompanies { get; set; }
    public DbSet<SubscriptionType> SubscriptionTypes { get; set; }
    public DbSet<Systems> Systems { get; set; }

    // Read-only views for cross-service queries
    public DbSet<MenuActionView> MenuActionViews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        // Force all string-based columns to non-unicode equivalent
        // when no column type is explicitly set.
        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null // No column type is set
                                                              // Next line only required if using ASP.Net Identity:
                                                              //&& p.DeclaringType.GetTableName().StartsWith("AspNet")
                     ))
            property.SetIsUnicode(false);

        BaseEntityRegistration.RegisterEntities(modelBuilder, typeof(ConfigurationContext),
            typeof(CompanyDemoStep),
            typeof(ScheduleCompany),
            typeof(PrinterDocument));

        Acontplus.Persistence.SqlServer.Configurations.SimpleEntityRegistration.RegisterEntities(modelBuilder, typeof(ConfigurationContext), typeof(Days));
    }
}
