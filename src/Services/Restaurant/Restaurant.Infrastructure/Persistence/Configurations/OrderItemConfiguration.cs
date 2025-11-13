using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class OrderItemConfiguration : BaseEntityTypeConfiguration<OrderItem>
{
    public override void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        base.Configure(builder);



        builder.HasIndex(x => x.OrderId)
            .HasDatabaseName("IX_OrderItem_OrderId")
            .IncludeProperties(x => new { x.ItemId, x.Status, x.Total });

        builder.HasIndex(x => x.ItemId)
            .HasDatabaseName("IX_OrderItem_ItemId");

        builder.HasIndex(x => new { x.OrderId, x.Status })
            .HasDatabaseName("IX_OrderItem_OrderId_Status")
            .HasFilter("[Status] IN (1, 2, 3)");

        builder.HasIndex(x => new { x.Status, x.CreatedAt })
            .HasDatabaseName("IX_OrderItem_Status_CreatedAt")
            .HasFilter("[Status] = 2");

        builder.Property(x => x.Status)
            .HasDefaultValue(OrderItemStatus.Pending);

        builder.Property(x => x.IsPaid)
            .HasDefaultValue(false);

        builder.Property(x => x.DiscountPercent)
            .HasDefaultValue(0);

        builder.Property(x => x.TaxValue)
            .HasDefaultValue(0m);

        builder.HasOne(x => x.Order)
            .WithMany(x => x.OrderItems)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Item)
            .WithMany(x => x.OrderItems)
            .HasForeignKey(x => x.ItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
