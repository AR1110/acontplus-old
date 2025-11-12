using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class ItemConfiguration : BaseEntityTypeConfiguration<Item>
{
    public override void Configure(EntityTypeBuilder<Item> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.ProductId)
            .HasDatabaseName("IX_Item_ProductId");

        builder.HasIndex(x => new { x.ProductId, x.IsActive })
            .HasDatabaseName("IX_Item_ProductId_IsActive")
            .HasFilter("[IsActive] = 1");

        builder.Property(x => x.IsActive)
            .HasDefaultValue(true);

        builder.Property(x => x.IsComposite)
            .HasDefaultValue(false);

        builder.Property(x => x.IsAvailableForPromotion)
            .HasDefaultValue(false);

        builder.Property(x => x.RequiresCooking)
            .HasDefaultValue(false);

        builder.HasOne(x => x.ProductionArea)
            .WithMany()
            .HasForeignKey(x => x.ProductionAreaId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.Compositions)
            .WithOne(x => x.ParentItem)
            .HasForeignKey(x => x.ParentItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.UsedInCompositions)
            .WithOne(x => x.ChildItem)
            .HasForeignKey(x => x.ChildItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.OrderItems)
            .WithOne(x => x.Item)
            .HasForeignKey(x => x.ItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.PromotionDetails)
            .WithOne(x => x.Item)
            .HasForeignKey(x => x.ItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
