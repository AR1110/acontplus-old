using System.Reflection;

namespace Inventory.Infrastructure.Persistence;

public class InventoryContext : BaseContext
{
    public InventoryContext(DbContextOptions<InventoryContext> options) : base(options)
    {
    }

    public DbSet<MotivoDiscrepancia> MotivoDiscrepancias { get; set; }
    public DbSet<StockFisico> StockFisicos { get; set; }
    public DbSet<StockFisicoDetalle> StockFisicoDetalles { get; set; }
    public DbSet<ProductPhoto> ProductPhotos { get; set; }
    public DbSet<SubcategoryPhoto> SubcategorytPhotos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null
                     ))
            property.SetIsUnicode(false);

        modelBuilder.Entity<MotivoDiscrepancia>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<StockFisico>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<StockFisico>()
            .HasMany(i => i.StockFisicoDetalles)
            .WithOne(d => d.StockFisico)
            .HasForeignKey(d => d.StockFisicoId);

        modelBuilder.Entity<ProductPhoto>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<ProductPhoto>().Property(x => x.IsActive).HasDefaultValue(true);

        modelBuilder.Entity<StockFisicoDetalle>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<StockFisicoDetalle>().Property(x => x.IsActive).HasDefaultValue(true);

        modelBuilder.Entity<SubcategoryPhoto>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<SubcategoryPhoto>().Property(x => x.IsActive).HasDefaultValue(true);
    }
}