using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class OrderDetailCompositionModifierConfiguration : BaseEntityTypeConfiguration<OrderDetailCompositionModifier>
{
    public override void Configure(EntityTypeBuilder<OrderDetailCompositionModifier> builder)
    {
        base.Configure(builder);

        // Indexes for high workload performance
        builder.HasIndex(x => x.OrderDetailId)
            .HasDatabaseName("IX_OrderDetailCompositionModifier_OrderDetailId");

        builder.HasIndex(x => x.ModifierCompositionId)
            .HasDatabaseName("IX_OrderDetailCompositionModifier_ModifierCompositionId");

        builder.HasIndex(x => new { x.OrderDetailId, x.ModifierCompositionId })
            .HasDatabaseName("IX_OrderDetailCompositionModifier_OrderDetail_Modifier");

        // Unique index on UniqueId if used for lookups
        builder.HasIndex(x => x.UniqueId)
            .HasDatabaseName("IX_OrderDetailCompositionModifier_UniqueId")
            .IsUnique()
            .HasFilter("[UniqueId] IS NOT NULL");

        // Decimal precision for high precision calculations
        builder.Property(x => x.Quantity).HasPrecision(18, 5);
        builder.Property(x => x.ExtraCharge).HasPrecision(18, 5);

        // String length optimization
        builder.Property(x => x.Instructions).HasMaxLength(500);

        // Relationships with optimized foreign keys
        builder
            .HasOne(x => x.OrderDetail)
            .WithMany(x => x.ModifiersComposition)
            .HasForeignKey(x => x.OrderDetailId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.ModifierComposition)
            .WithMany()
            .HasForeignKey(x => x.ModifierCompositionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
