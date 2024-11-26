using System.Reflection;
using Common.Infrastructure.Data.Configurations;

namespace Contabilidad.API.Data;

public class ContabilidadContext : BaseContext
{
    public ContabilidadContext(DbContextOptions<ContabilidadContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Tipo> Tipos { get; set; }
    public DbSet<Subcategory> Subcategories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(
                         p => p.ClrType == typeof(string) // Entity is a string
                              && p.GetColumnType() == null
                     ))
        {
            property.SetIsUnicode(false);
        }

        modelBuilder.Entity<Category>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<Category>().Property(p => p.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<Category>().HasMany(c => c.Subcategories).WithOne(c => c.Category)
            .HasForeignKey(c => c.CategoryId);
        modelBuilder.Entity<Category>().HasIndex(x => x.Code)
            .HasDatabaseName("UI_Contabilidad_Category_Code")
            .IsUnique();

        modelBuilder.Entity<Subcategory>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<Subcategory>().Property(p => p.Enabled).HasDefaultValue(true);

        modelBuilder.Entity<Tipo>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<Tipo>().Property(p => p.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<Tipo>().HasIndex(x => x.Code)
            .HasDatabaseName("UI_Contabilidad_Tipo_Code")
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
