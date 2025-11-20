// No changes needed, as entity didn't change.

using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class MealScheduleSettingConfiguration : BaseEntityTypeConfiguration<MealScheduleSetting>
{
    public override void Configure(EntityTypeBuilder<MealScheduleSetting> builder)
    {
        base.Configure(builder);

        // ✅ OPTIMIZED INDEXES FOR HIGH WORKLOAD

        // Real-time meal time validation (most frequent during QR scans)
        builder
            .HasIndex(x => new { x.EstablishmentId, x.StartTime, x.EndTime, x.DisplayOrder })
            .HasDatabaseName("IX_MealScheduleSetting_Time_Active")
            .IncludeProperties(x => new { x.MealCode, x.Description });

        // Meal code lookups
        builder
            .HasIndex(x => new { x.EstablishmentId, x.MealCode })
            .HasDatabaseName("IX_MealScheduleSetting_Establishment_Code")
            .IsUnique();

        // Display order for UI
        builder
            .HasIndex(x => new { x.EstablishmentId, x.DisplayOrder })
            .HasDatabaseName("IX_MealScheduleSetting_Establishment_Order")
            .IncludeProperties(x => new { x.MealCode, x.Description, x.StartTime, x.EndTime });
    }
}
