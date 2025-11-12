using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class PromotionConfiguration : BaseEntityTypeConfiguration<Promotion>
{
    public override void Configure(EntityTypeBuilder<Promotion> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.EstablishmentId)
            .HasDatabaseName("IX_Promotion_EstablishmentId");

        builder.HasIndex(x => new { x.EstablishmentId, x.IsActive, x.StartDate, x.EndDate })
            .HasDatabaseName("IX_Promotion_Establishment_Active_Dates")
            .HasFilter("[IsActive] = 1");

        builder.HasIndex(x => new { x.Type, x.IsActive })
            .HasDatabaseName("IX_Promotion_Type_Active")
            .HasFilter("[IsActive] = 1");

        builder.Property(x => x.IsActive)
            .HasDefaultValue(true);

        builder.Property(x => x.CurrentUses)
            .HasDefaultValue(0);

        builder.HasMany(x => x.PromotionDetails)
            .WithOne(x => x.Promotion)
            .HasForeignKey(x => x.PromotionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PromotionDetailConfiguration : BaseEntityTypeConfiguration<PromotionDetail>
{
    public override void Configure(EntityTypeBuilder<PromotionDetail> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.PromotionId)
            .HasDatabaseName("IX_PromotionDetail_PromotionId")
            .IncludeProperties(x => new { x.ItemId, x.Role, x.PromotionalPrice });

        builder.HasIndex(x => x.ItemId)
            .HasDatabaseName("IX_PromotionDetail_ItemId");

        builder.HasIndex(x => new { x.PromotionId, x.DisplayOrder })
            .HasDatabaseName("IX_PromotionDetail_Promotion_DisplayOrder");

        builder.Property(x => x.RequiredQuantity)
            .HasDefaultValue(1);

        builder.Property(x => x.Role)
            .HasDefaultValue(PromotionItemRole.Included);

        builder.Property(x => x.DisplayOrder)
            .HasDefaultValue(0);

        builder.HasOne(x => x.Promotion)
            .WithMany(x => x.PromotionDetails)
            .HasForeignKey(x => x.PromotionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Item)
            .WithMany(x => x.PromotionDetails)
            .HasForeignKey(x => x.ItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
