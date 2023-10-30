using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Configuracion.API.Data
{
    public class ConfigContext : BaseContext
    {
        public ConfigContext(DbContextOptions<ConfigContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }

        //public override int SaveChanges()
        //{
        //    var entries = ChangeTracker
        //        .Entries()
        //        .Where(e => e.Entity is BaseEntity && (
        //                e.State == EntityState.Added
        //                || e.State == EntityState.Modified));

        //    foreach (var entityEntry in entries)
        //    {
        //        if (entityEntry.State == EntityState.Modified)
        //        {
        //            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
        //        }

        //        //if (entityEntry.State == EntityState.Added)
        //        //{
        //        //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
        //        //}
        //    }

        //    return base.SaveChanges();
        //}
        //public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        //{
        //    var entries = ChangeTracker
        //        .Entries()
        //        .Where(e => e.Entity is BaseEntity && (
        //                e.State == EntityState.Added
        //                || e.State == EntityState.Modified));

        //    foreach (var entityEntry in entries)
        //    {
        //        if (entityEntry.State == EntityState.Modified)
        //        {
        //            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
        //        }
        //        //if (entityEntry.State == EntityState.Added)
        //        //{
        //        //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
        //        //}
        //    }
        //    int result = await base.SaveChangesAsync(cancellationToken);
        //    return result;
        //}
    }
}
