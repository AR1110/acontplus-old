using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Contabilidad.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : BaseEntityTypeConfiguration<Category>
{
    public override void Configure(EntityTypeBuilder<Category> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UI_Contabilidad_Category_Code")
            .IsUnique();

        builder
            .HasMany(c => c.Subcategories)
            .WithOne(c => c.Category)
            .HasForeignKey(c => c.CategoryId);
    }
}
public class TipoConfiguration : BaseEntityTypeConfiguration<Tipo>
{
    public override void Configure(EntityTypeBuilder<Tipo> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UI_Contabilidad_Tipo_Code")
            .IsUnique();
    }
}
public class AccountConfiguration : BaseEntityTypeConfiguration<Account>
{
    public override void Configure(EntityTypeBuilder<Account> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UI_Contabilidad_Accont_Code")
            .IsUnique();

        builder
            .HasOne(a => a.ParentAccount)
            .WithMany(a => a.ChildAccounts)
            .HasForeignKey(a => a.ParentAccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
