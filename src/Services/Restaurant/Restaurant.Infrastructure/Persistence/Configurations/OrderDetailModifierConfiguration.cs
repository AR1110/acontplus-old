using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class OrderDetailModifierConfiguration : BaseEntityTypeConfiguration<OrderDetailModifier>
{
    public override void Configure(EntityTypeBuilder<OrderDetailModifier> builder)
    {
        base.Configure(builder);

        // Indexes for performance
        builder.HasIndex(x => x.OrderDetailId)
            .HasDatabaseName("IX_OrderDetailModifier_OrderDetailId");

        builder.HasIndex(x => x.ModifierItemId)
            .HasDatabaseName("IX_OrderDetailModifier_ModifierItemId");

        // Decimal precision
        builder.Property(x => x.Quantity).HasPrecision(18, 5);
        builder.Property(x => x.ExtraCharge).HasPrecision(18, 5);

        // Relationships
        builder
            .HasOne(x => x.OrderDetail)
            .WithMany(x => x.Modifiers)
            .HasForeignKey(x => x.OrderDetailId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.ModifierItem)
            .WithMany()
            .HasForeignKey(x => x.ModifierItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
