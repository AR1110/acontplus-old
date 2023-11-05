using Common.Core.Entities;
using Common.Infrastructure.Data;
using Inventario.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Infrastructure.Data
{
    public class InventarioContext : BaseContext
    {
        public InventarioContext(DbContextOptions<InventarioContext> options) : base(options)
        {
        }
        public DbSet<MotivoDiscrepancia> MotivoDiscrepancias { get; set; }
        public DbSet<StockFisico> StockFisicos { get; set; }
        public DbSet<StockFisicoDetalle> StockFisicoDetalles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                    .SelectMany(t => t.GetProperties())
                    .Where(
                           p => p.ClrType == typeof(string)    // Entity is a string
                        && p.GetColumnType() == null
                    ))
            {
                property.SetIsUnicode(false);
            }
            modelBuilder.Entity<MotivoDiscrepancia>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<StockFisico>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<StockFisico>()
           .HasMany(i => i.StockFisicoDetalles)
           .WithOne(d => d.StockFisico)
           .HasForeignKey(d => d.StockFisicoId);

            modelBuilder.Entity<StockFisicoDetalle>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
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
            int result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
