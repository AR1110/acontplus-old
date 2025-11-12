using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

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

        builder.HasIndex(x => x.Uuid)
            .HasDatabaseName("UX_Order_Uuid")
            .IsUnique();

        builder.HasIndex(x => new { x.EstablecimientoId, x.Finished, x.CreatedAt })
            .HasDatabaseName("IX_Order_Establishment_Finished_Date")
            .HasFilter("[Finished] = 0");

        builder.HasIndex(x => x.TableId)
            .HasDatabaseName("IX_Order_TableId")
            .HasFilter("[TableId] IS NOT NULL AND [Finished] = 0");

        builder.HasIndex(x => new { x.CustomerCompanyId, x.CreatedAt })
            .HasDatabaseName("IX_Order_Customer_Date");

        builder.Property(x => x.Finished)
            .HasDefaultValue(false);

        builder.Property(x => x.Divided)
            .HasDefaultValue(false);

        builder.HasOne(x => x.AppTable)
            .WithMany()
            .HasForeignKey(x => x.TableId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.OrderItems)
            .WithOne(m => m.Order)
            .HasForeignKey(m => m.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.MealConsumptions)
            .WithOne(x => x.Order)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}