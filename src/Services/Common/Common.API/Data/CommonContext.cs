using System.Reflection;
using Common.API.Entities;
using Common.Core.Entities;
using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Common.API.Data;

public class CommonContext : BaseContext
{
    public CommonContext(DbContextOptions<CommonContext> options) : base(options)
    {
    }
    public DbSet<EstadoCivil> EstadosCivil { get; set; }
    public DbSet<TipoVivienda> TiposVivienda { get; set; }


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
         
        modelBuilder.Entity<EstadoCivil>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<EstadoCivil>().Property(x => x.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<EstadoCivil>().HasIndex(x => x.Code).HasDatabaseName("UI_EstadoCivil_Code").IsUnique();

        modelBuilder.Entity<TipoVivienda>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<TipoVivienda>().Property(x => x.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<TipoVivienda>().HasIndex(x => x.Code).HasDatabaseName("UI_TipoVivienda_Code").IsUnique();


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
