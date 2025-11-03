using System.Reflection;

namespace Accounting.Infrastructure.Persistence;

public class AccountingContext : BaseContext
{
    public AccountingContext(DbContextOptions<AccountingContext> options) : base(options)
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

        BaseEntityRegistration.RegisterEntities(modelBuilder, typeof(AccountingContext),
            typeof(Subcategory));
    }
}
