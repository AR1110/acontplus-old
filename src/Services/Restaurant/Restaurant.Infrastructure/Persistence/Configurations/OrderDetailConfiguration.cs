using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class OrderDetailConfiguration : BaseEntityTypeConfiguration<OrderDetail>
{
    public override void Configure(EntityTypeBuilder<OrderDetail> builder)
    {
        base.Configure(builder);

        // Indexes for high workload performance
        builder.HasIndex(x => x.OrderId)
            .HasDatabaseName("IX_OrderDetail_OrderId");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_OrderDetail_Status_Only");

        builder.HasIndex(x => new { x.OrderId, x.Status })
            .HasDatabaseName("IX_OrderDetail_OrderId_Status");

        builder.HasIndex(x => x.ItemId)
            .HasDatabaseName("IX_OrderDetail_ItemId");

        // Decimal precision
        builder.Property(x => x.TaxValue).HasPrecision(18, 5);
        builder.Property(x => x.Quantity).HasPrecision(18, 5);
        builder.Property(x => x.UnitPrice).HasPrecision(18, 5);
        builder.Property(x => x.SalePrice).HasPrecision(18, 5);
        builder.Property(x => x.Discount).HasPrecision(5, 2);
        builder.Property(x => x.DiscountPercent).HasPrecision(5, 2);
        builder.Property(x => x.Subtotal).HasPrecision(18, 5);
        builder.Property(x => x.Total).HasPrecision(18, 5);
        builder.Property(x => x.RemainingQuantity).HasPrecision(18, 5);

        // Relationships
        builder
            .HasOne(x => x.Order)
            .WithMany(x => x.OrderDetails)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Item)
            .WithMany()
            .HasForeignKey(x => x.ItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(x => x.Modifiers)
            .WithOne(x => x.OrderDetail)
            .HasForeignKey(x => x.OrderDetailId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
