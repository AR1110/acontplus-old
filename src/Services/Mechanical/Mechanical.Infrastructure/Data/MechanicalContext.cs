using Mechanical.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mechanical.Infrastructure.Data
{
    public class MechanicalContext : DbContext
    {
        public MechanicalContext(DbContextOptions<MechanicalContext> options) : base(options)
        {

        }
        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleCompany> VehicleCompanys { get; set; }
        public DbSet<SupportType> SupportTypes { get; set; }
        public DbSet<Support> Supports { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                    .SelectMany(t => t.GetProperties())
                    .Where(
                           p => p.ClrType == typeof(string)
                        && p.GetColumnType() == null
                    ))
            {
                property.SetIsUnicode(false);
            }
            modelBuilder.Entity<VehicleType>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<VehicleType>().HasIndex(x => x.Code)
           .HasDatabaseName("UXC_Mechanical_Code")
           .IsUnique();

            modelBuilder.Entity<Vehicle>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Vehicle>().HasIndex(x => x.LicensePlate)
           .HasDatabaseName("UXC_Mechanical_LicensePlate")
           .IsUnique();

            modelBuilder.Entity<SupportType>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<SupportType>().HasIndex(x => x.Code)
           .HasDatabaseName("UXC_SupportType_Code")
           .IsUnique();

            modelBuilder.Entity<Support>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
           
            modelBuilder.Entity<VehicleCompany>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
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
            }
            int result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
