using System.Reflection;
using Common.Core.Entities;
using Common.Infrastructure.Data;
using FactElect.Core.Entities;
using FactElect.Infrastructure.Config;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                foreach (var property in properties)
                {
                    builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                }
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

        builder.ApplyConfiguration(new CustomerConfiguration());
        builder.ApplyUtcDateTimeConverter();
    }

    public override int SaveChanges()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added
                || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Modified)
            {
                ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
            }

            //if (entityEntry.State == EntityState.Added)
            //{
            //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
            //}
        }

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added
                || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Modified)
            {
                ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
            }
            //if (entityEntry.State == EntityState.Added)
            //{
            //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
            //}
        }

        var result = await base.SaveChangesAsync(cancellationToken);
        return result;
    }
}

public static class UtcDateAnnotation
{
    private const string IsUtcAnnotation = "IsUtc";

    private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
        new(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
        new(v => v, v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

    public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder,
        bool isUtc = true)
    {
        return builder.HasAnnotation(IsUtcAnnotation, isUtc);
    }

    public static bool IsUtc(this IMutableProperty property)
    {
        return (bool?)property.FindAnnotation(IsUtcAnnotation)?.Value ?? true;
    }

    /// <summary>
    ///     Make sure this is called after configuring all your entities.
    /// </summary>
    public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
    {
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (!property.IsUtc())
                {
                    continue;
                }

                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(UtcConverter);
                }

                if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(UtcNullableConverter);
                }
            }
        }
    }
}
