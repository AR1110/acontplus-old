using System.Reflection;
using Common.Infrastructure.Data;
using Contabilidad.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace Contabilidad.Infrastructure.Data
{
    public class ContabilidadContext : BaseContext
    {
        public ContabilidadContext(DbContextOptions<ContabilidadContext> options) : base(options)
        {
        }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Tipo> Tipos { get; set; }
        public DbSet<SubCategoria> Subcategorias { get; set; }
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
            modelBuilder.Entity<Categoria>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Categoria>().HasIndex(x => x.Codigo)
           .HasDatabaseName("UXC_CContabilidad_Codigo")
           .IsUnique();

            modelBuilder.Entity<Tipo>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Tipo>().HasIndex(x => x.Codigo)
           .HasDatabaseName("UXT_CContabilidad_Codigo")
           .IsUnique();

            // Datos para la tabla SubCategoria
            modelBuilder.Entity<SubCategoria>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<SubCategoria>().HasIndex(x => x.Codigo)
           .HasDatabaseName("UXSC_CContabilidad_Codigo")
           .IsUnique();
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
