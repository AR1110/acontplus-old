namespace Common.Infrastructure.Context;

public abstract class BaseContext : DbContext
{
    protected BaseContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure default schema
        modelBuilder.HasDefaultSchema("dbo");

        // Configure decimal properties to use double conversion
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        // Force all string-based columns to non-unicode equivalent when no column type is explicitly set
        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) && p.GetColumnType() == null))
            property.SetIsUnicode(false);
    }
}
