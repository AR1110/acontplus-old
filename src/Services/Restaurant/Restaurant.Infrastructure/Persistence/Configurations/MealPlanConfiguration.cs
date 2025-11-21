// No major changes needed, but ensured it aligns with MealPlan entity updates (no nav changes).

using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class MealPlanConfiguration : BaseEntityTypeConfiguration<MealPlan>
{
    public override void Configure(EntityTypeBuilder<MealPlan> builder)
    {
        base.Configure(builder);

        builder
            .Property(x => x.IsDefault)
            .HasDefaultValue(false)
            .IsRequired();

        // ✅ OPTIMIZED INDEXES FOR HIGH WORKLOAD

        // Establishment-based plan lookups
        builder
            .HasIndex(x => new { x.EstablishmentId, x.Name })
            .HasDatabaseName("IX_MealPlan_Establishment_Name")
            .IncludeProperties(x => new { x.DailyMealLimit, x.MonthlyMealLimit, x.SubsidyPercentage });

        // Plan details for cost calculations
        builder
            .HasIndex(x => x.EstablishmentId)
            .HasDatabaseName("IX_MealPlan_Establishment")
            .IncludeProperties(x => new { x.Name, x.DailyMealLimit, x.MonthlyMealLimit, x.SubsidyPercentage });
    }
}
