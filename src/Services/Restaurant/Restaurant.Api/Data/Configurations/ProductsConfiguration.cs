using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Restaurant.Api.Entities;

namespace Restaurant.Api.Data.Configurations;

public class IngredientTypeConfiguration : BaseEntityTypeConfiguration<IngredientType>
{
    public override void Configure(EntityTypeBuilder<IngredientType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_IngredientType_Code")
            .IsUnique();
    }
}

public class ItemTypeConfiguration : BaseEntityTypeConfiguration<ItemType>
{
    public override void Configure(EntityTypeBuilder<ItemType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_ItemType_Code")
            .IsUnique();
    }
}

public class MenuConfiguration : BaseEntityTypeConfiguration<Menu>
{
    public override void Configure(EntityTypeBuilder<Menu> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.MenuItems)
            .WithOne(m => m.Menu)
            .HasForeignKey(m => m.MenuId);
    }
}

public class MenuTypeConfiguration : BaseEntityTypeConfiguration<MenuType>
{
    public override void Configure(EntityTypeBuilder<MenuType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_MenuType_Code")
            .IsUnique();
    }
}

public class OrderConfiguration : BaseEntityTypeConfiguration<Order>
{
    public override void Configure(EntityTypeBuilder<Order> builder)
    {
        base.Configure(builder);

        builder
            .Property(x => x.Finished)
            .HasDefaultValue(false);

        builder
            .Property(x => x.Divided)
            .HasDefaultValue(false);

        builder
            .HasMany(x => x.OrderItems)
            .WithOne(m => m.Order)
            .HasForeignKey(m => m.OrderId);
    }
}