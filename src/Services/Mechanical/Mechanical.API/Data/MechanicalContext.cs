using Common.Core.Entities;
using Common.Infrastructure.Data;
using Mechanical.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mechanical.API.Data
{
    public class MechanicalContext : BaseContext
    {
        public MechanicalContext(DbContextOptions<MechanicalContext> options) : base(options)
        {

        }
        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleCompany> VehicleCompanys { get; set; }
        public DbSet<Support> Supports { get; set; }
        public DbSet<VehiclePartType> vehiclePartTypes { get; set; }
        public DbSet<VehiclePart> vehicleParts { get; set; }
        public DbSet<Inspection> inspections { get; set; }
        public DbSet<SupportDetail> maintenanceDetails { get; set; }

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

            modelBuilder.Entity<Support>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<VehicleCompany>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<VehiclePartType>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<VehiclePartType>().HasIndex(x => x.Code)
            .HasDatabaseName("UXC_VehiclePartType_Code")
            .IsUnique();

            modelBuilder.Entity<VehiclePart>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<VehiclePart>().HasIndex(x => x.Code)
            .HasDatabaseName("UXC_VehiclePart_Code")
            .IsUnique();

            modelBuilder.Entity<Inspection>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<SupportDetail>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");

            //modelBuilder.Entity<Maintenance>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
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
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
