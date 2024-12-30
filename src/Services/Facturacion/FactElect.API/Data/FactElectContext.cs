using System.Reflection;
using FactElect.API.Data.Config;
using FactElect.API.Entities;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FactElect.API.Data;

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

        builder.ApplyConfiguration(new CustomerConfiguration());
        builder.ApplyUtcDateTimeConverter();
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
