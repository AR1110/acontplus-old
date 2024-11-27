using System.Reflection;

namespace Configuracion.API.Data;

public class ConfigContext : BaseContext
{
    public ConfigContext(DbContextOptions<ConfigContext> options) : base(options)
    {
    }

    public DbSet<Printer> Printers { get; set; }
    public DbSet<PrinterDocument> PrinterDocuments { get; set; }
    public DbSet<PrinterType> PrinterTypes { get; set; }
    public DbSet<EstablecimientoLogo> EstablecimientoLogos { get; set; }

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

        // Force all string-based columns to non-unicode equivalent 
        // when no column type is explicitly set.
        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(
                         p => p.ClrType == typeof(string) // Entity is a string
                              && p.GetColumnType() == null // No column type is set
                                                           // Next line only required if using ASP.Net Identity:
                                                           //&& p.DeclaringType.GetTableName().StartsWith("AspNet")
                     ))
        {
            property.SetIsUnicode(false);
        }

        SimpleEntityRegistration.RegisterEntities(builder, typeof(PrinterDocument));
    }
}
