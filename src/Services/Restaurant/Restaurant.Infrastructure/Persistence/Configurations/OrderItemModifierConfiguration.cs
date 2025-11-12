using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class OrderItemModifierConfiguration : BaseEntityTypeConfiguration<OrderItemModifier>
{
    public override void Configure(EntityTypeBuilder<OrderItemModifier> builder)
    {
        base.Configure(builder);

        // Índice principal para consultas por OrderItem
        builder.HasIndex(x => x.OrderItemId)
            .HasDatabaseName("IX_OrderItemModifier_OrderItemId")
            .IncludeProperties(x => new { x.ModifierItemId, x.Action, x.ExtraCharge });

        // Índice para consultas por modificador
        builder.HasIndex(x => x.ModifierItemId)
            .HasDatabaseName("IX_OrderItemModifier_ModifierItemId");

        // Índice compuesto para evitar duplicados
        builder.HasIndex(x => new { x.OrderItemId, x.ModifierItemId, x.Action })
            .HasDatabaseName("UX_OrderItemModifier_OrderItem_Modifier_Action")
            .IsUnique();

        // Índice para reportes de modificadores más usados
        builder.HasIndex(x => new { x.ModifierItemId, x.Action, x.CreatedAt })
            .HasDatabaseName("IX_OrderItemModifier_Modifier_Action_Date");

        builder.Property(x => x.Action)
            .HasDefaultValue(ModifierAction.Add);

        builder.Property(x => x.ExtraCharge)
            .HasDefaultValue(0);

        builder.Property(x => x.Quantity)
            .HasDefaultValue(1);

        builder.HasOne(x => x.OrderItem)
            .WithMany(x => x.Modifiers)
            .HasForeignKey(x => x.OrderItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ModifierItem)
            .WithMany()
            .HasForeignKey(x => x.ModifierItemId)
            .OnDelete(DeleteBehavior.Restrict);

        // Particionamiento por fecha para alta carga (opcional, requiere SQL Server Enterprise)
        // builder.ToTable("OrderItemModifier", tb => tb.HasCheckConstraint("CK_OrderItemModifier_CreatedAt", "[CreatedAt] >= '2024-01-01'"));
    }
}
