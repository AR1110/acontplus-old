using System.Reflection;

namespace Billing.Infrastructure.Persistence;

public class BillingContext(DbContextOptions<BillingContext> options) : BaseContext(options)
{
    public DbSet<ConceptoRetencionAir> ConceptoRetencionAirs { get; set; }
    public DbSet<AppCustomer> Customers { get; set; }
    public DbSet<FormaPago> FormasPago { get; set; }
    public DbSet<ImpuestoRetencion> ImpuestosRetencion { get; set; }
    public DbSet<Pais> Paises { get; set; }
    public DbSet<ParaisoFiscal> ParaisosFiscales { get; set; }
    public DbSet<PorcentajeRetencionAir> PorcentajeRetencionAirs { get; set; }
    public DbSet<PorcentajeRetencionIva> PorcentajesRetencionIva { get; set; }
    public DbSet<SustentoTributario> SustentosTributarios { get; set; }
    public DbSet<TipoComprobante> TipoComprobantes { get; set; }
    public DbSet<TipoIdentificacionProveedor> TiposIdentificacionProveedor { get; set; }
    public DbSet<TipoPago> TipoPagos { get; set; }
    public DbSet<TipoRegimenFiscalExterior> TiposRegimenFiscalExterior { get; set; }

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

        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null // No column type is set
                                                              // Next line only required if using ASP.Net Identity:
                     ))
            property.SetIsUnicode(false);
    }
}
