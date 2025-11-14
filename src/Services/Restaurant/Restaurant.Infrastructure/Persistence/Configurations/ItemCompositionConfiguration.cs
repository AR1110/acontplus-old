using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class ItemCompositionConfiguration : BaseEntityTypeConfiguration<ItemComposition>
{
    public override void Configure(EntityTypeBuilder<ItemComposition> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.ParentItemId)
            .HasDatabaseName("IX_ItemComposition_ParentItemId");

        builder.HasIndex(x => x.ChildItemId)
            .HasDatabaseName("IX_ItemComposition_ChildItemId");

        builder.HasIndex(x => new { x.ParentItemId, x.ChildItemId })
            .HasDatabaseName("UX_ItemComposition_Parent_Child")
            .IsUnique();

        builder.HasIndex(x => new { x.ParentItemId, x.DisplayOrder })
            .HasDatabaseName("IX_ItemComposition_Parent_DisplayOrder");

        builder.Property(x => x.CompositionLevel)
            .HasDefaultValue(1);

        builder.Property(x => x.IsOptional)
            .HasDefaultValue(false);

        builder.Property(x => x.IsDefault)
            .HasDefaultValue(true);

        builder.Property(x => x.DisplayOrder)
            .HasDefaultValue(0);

        // Decimal precision
        builder.Property(x => x.Quantity).HasPrecision(18, 5);
        builder.Property(x => x.UnitPrice).HasPrecision(18, 5);
        builder.Property(x => x.SalePrice).HasPrecision(18, 5);
        builder.Property(x => x.TotalCost).HasPrecision(18, 5);
        builder.Property(x => x.TotalPrice).HasPrecision(18, 5);
        builder.Property(x => x.WastePercentage).HasPrecision(5, 2);
        builder.Property(x => x.ExtraCharge).HasPrecision(18, 5);

        builder.HasOne(x => x.ParentItem)
            .WithMany(x => x.Compositions)
            .HasForeignKey(x => x.ParentItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ChildItem)
            .WithMany(x => x.UsedInCompositions)
            .HasForeignKey(x => x.ChildItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ParentComposition)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentCompositionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
