using System.Reflection;
using Common.API.Entities;
using Common.Core.Entities;
using Common.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Common.API.Data;

public class CommonContext : BaseContext
{
    public CommonContext(DbContextOptions<CommonContext> options) : base(options)
    {
    }
    public DbSet<MaritalStatus> MaritalStatuses { get; set; }
    public DbSet<HousingType> HousingTypes { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                foreach (var property in properties)
                {
                    modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                }
            }

            // Force all string-based columns to non-unicode equivalent 
            // when no column type is explicitly set.
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                         .SelectMany(t => t.GetProperties())
                         .Where(
                             p => p.ClrType == typeof(string) // Entity is a string
                                  && p.GetColumnType() == null // No column type is set
                         ))
            {
                property.SetIsUnicode(false);
            }
        }
         
        modelBuilder.Entity<MaritalStatus>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<MaritalStatus>().Property(x => x.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<MaritalStatus>().HasIndex(x => x.Code).HasDatabaseName("UI_MaritalStatus_Code").IsUnique();

        modelBuilder.Entity<HousingType>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<HousingType>().Property(x => x.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<HousingType>().HasIndex(x => x.Code).HasDatabaseName("UI_HousingType_Code").IsUnique();


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
