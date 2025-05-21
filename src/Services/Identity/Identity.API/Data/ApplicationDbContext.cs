using System.Reflection;
using Common.Infrastructure.Core.Entity;

namespace Identity.API.Data;

public class ApplicationDbContext : BaseContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<ForgotPassword> ForgotPasswords { get; set; }
    public DbSet<LoginHistory> LoginHistories { get; set; }
    public DbSet<LoginHistoryArchive> LoginHistoryArchives { get; set; }
    public DbSet<LoginFailed> LoginFaileds { get; set; }
    public DbSet<AccessAuthorization> AccessAuthorizations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        //Force all string-based columns to non - unicode equivalent
        //when no column type is explicitly set.
        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null // No column type is set
                                                              // Next line only required if using ASP.Net Identity:
                                                              //&& p.DeclaringType.GetTableName().StartsWith("AspNet")
                     ))
            property.SetIsUnicode(false);

        SimpleEntityRegistration.RegisterEntities(builder,
            typeof(AccessAuthorization),
            typeof(LoginHistory),
            typeof(LoginHistoryArchive),
            typeof(LoginFailed),
            typeof(ForgotPassword)
            );
    }
}
