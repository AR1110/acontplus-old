using Common.Infrastructure.Entity;
using System.Reflection;

namespace Contabilidad.Infrastructure.Persistence;

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
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null
                     ))
            property.SetIsUnicode(false);

        SimpleEntityRegistration.RegisterEntities(modelBuilder, typeof(ContabilidadContext),
            typeof(Subcategory));
    }
}
