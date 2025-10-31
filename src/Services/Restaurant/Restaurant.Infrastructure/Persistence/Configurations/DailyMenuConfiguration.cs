// Minor tweak: Added index for MealPlanId if querying menus by plan.
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Restaurant.Domain.Entities.MealManagement;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class DailyMenuConfiguration : BaseEntityTypeConfiguration<DailyMenu>
{
    public override void Configure(EntityTypeBuilder<DailyMenu> builder)
    {
        base.Configure(builder);

        // Foreign key relationships
        builder
            .HasOne(x => x.MealPlan)
            .WithMany(x => x.DailyMenus)
            .HasForeignKey(x => x.MealPlanId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.MealScheduleSetting)
            .WithMany(x => x.DailyMenus)
            .HasForeignKey(x => x.MealScheduleSettingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder
            .HasIndex(x => new { x.EstablishmentId, x.MenuDate, x.MealScheduleSettingId })
            .HasDatabaseName("IX_DailyMenu_Establishment_Date_Schedule")
            .IsUnique();

        // New: For plan-specific menu lookups
        builder
            .HasIndex(x => x.MealPlanId)
            .HasDatabaseName("IX_DailyMenu_MealPlan")
            .HasFilter("MealPlanId IS NOT NULL")
            .IncludeProperties(x => new { x.MenuDate, x.Description, x.StandardPrice });
    }
}
