using System.Reflection;

namespace FactElect.Infrastructure.Data;

public class FactElectContext : BaseContext
{
    public FactElectContext(DbContextOptions<FactElectContext> options) : base(options)
    {
    }

    public DbSet<AppCustomer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
            {
                builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
            }
        }

        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(
                         p => p.ClrType == typeof(string) // Entity is a string
                              && p.GetColumnType() == null // No column type is set
                         // Next line only required if using ASP.Net Identity:
                     ))
        {
            property.SetIsUnicode(false);
        }
    }
}
