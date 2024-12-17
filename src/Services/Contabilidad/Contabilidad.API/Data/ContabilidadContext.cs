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
    public DbSet<Account> Accounts { get; set; }

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

        modelBuilder.Entity<Account>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<Account>().Property(p => p.Enabled).HasDefaultValue(true);
        modelBuilder.Entity<Account>().HasIndex(p => p.Code)
            .HasDatabaseName("UI_Contabilidad_Accont_Code")
            .IsUnique();

        modelBuilder.Entity<Account>().HasOne(a => a.ParentAccount).WithMany(a => a.ChildAccounts)
            .HasForeignKey(a => a.ParentAccountId)
            .OnDelete(DeleteBehavior.Restrict); 

    }
}
