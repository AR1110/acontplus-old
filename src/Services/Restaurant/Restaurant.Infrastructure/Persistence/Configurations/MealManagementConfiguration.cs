using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Restaurant.Domain.Entities.MealManagement;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class EmployeeMealPlanConfiguration : BaseEntityTypeConfiguration<CompanyCustomerMealPlan>
{
    public override void Configure(EntityTypeBuilder<CompanyCustomerMealPlan> builder)
    {
        base.Configure(builder);

        // Foreign key relationships
        builder
            .HasOne(x => x.MealPlan)
            .WithMany(x => x.CompanyCustomerMealPlans)
            .HasForeignKey(x => x.MealPlanId)
            .OnDelete(DeleteBehavior.Restrict);

        // ✅ OPTIMIZED INDEXES FOR HIGH WORKLOAD

        // Historical assignment tracking
        builder
            .HasIndex(x => new { x.CompanyCustomerId, x.MealPlanId, x.StartDate })
            .HasDatabaseName("IX_EmployeeMealPlan_Customer_Plan_StartDate");

        // Customer-based active plan lookup
        builder
            .HasIndex(x => new { x.CompanyCustomerId, x.IsActive })
            .HasDatabaseName("IX_EmployeeMealPlan_Customer_Active")
            .IncludeProperties(x => new { x.MealPlanId, x.StartDate, x.EndDate });
    }
}

public class MonthlyMealAllowanceConfiguration : BaseEntityTypeConfiguration<MonthlyMealAllowance>
{
    public override void Configure(EntityTypeBuilder<MonthlyMealAllowance> builder)
    {
        base.Configure(builder);

        // Foreign key relationships
        builder
            .HasOne(x => x.CompanyCustomerMealPlan)
            .WithMany(x => x.MonthlyMealAllowances)
            .HasForeignKey(x => x.CompanyCustomerMealPlanId)
            .OnDelete(DeleteBehavior.Restrict);

        // ✅ OPTIMIZED INDEXES FOR HIGH WORKLOAD

        // Primary unique constraint
        builder
            .HasIndex(x => new { x.CompanyCustomerMealPlanId, x.Year, x.Month })
            .HasDatabaseName("IX_MonthlyMealAllowance_Plan_YearMonth")
            .IsUnique();

        // Current month lookups (most frequent query)
        builder
            .HasIndex(x => new { x.Year, x.Month, x.CompanyCustomerMealPlanId })
            .HasDatabaseName("IX_MonthlyMealAllowance_Current")
            .IncludeProperties(x => new { x.AllocatedMeals, x.ConsumedMeals, x.RemainingMeals });

        // Active allowances with remaining meals
        builder
            .HasIndex(x => new { x.RemainingMeals, x.Year, x.Month })
            .HasDatabaseName("IX_MonthlyMealAllowance_Remaining")
            .HasFilter("RemainingMeals > 0");
    }
}

public class MealPlanConfiguration : BaseEntityTypeConfiguration<MealPlan>
{
    public override void Configure(EntityTypeBuilder<MealPlan> builder)
    {
        base.Configure(builder);

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
    }
}

public class MealConsumptionConfiguration : BaseEntityTypeConfiguration<MealConsumption>
{
    public override void Configure(EntityTypeBuilder<MealConsumption> builder)
    {
        base.Configure(builder);

        // Foreign key relationships
        builder
            .HasOne(x => x.Order)
            .WithMany(x => x.MealConsumptions)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.MealScheduleSetting)
            .WithMany(x => x.MealConsumptions)
            .HasForeignKey(x => x.MealScheduleSettingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.MonthlyMealAllowance)
            .WithMany(x => x.MealConsumptions)
            .HasForeignKey(x => x.MonthlyAllowanceId)
            .OnDelete(DeleteBehavior.Restrict);

        // ✅ OPTIMIZED INDEXES FOR HIGH WORKLOAD

        // Primary consumption lookup (most frequent query)
        builder
            .HasIndex(x => new { x.MonthlyAllowanceId, x.ConsumptionDate, x.MealScheduleSettingId })
            .HasDatabaseName("IX_MealConsumption_Allowance_Date_Schedule")
            .IncludeProperties(x => new { x.Status, x.Amount, x.SubsidyAmount, x.CompanyCustomerPayment });

        // Daily limit validation (real-time checks)
        builder
            .HasIndex(x => new { x.ConsumptionDate, x.MealScheduleSettingId, x.Status })
            .HasDatabaseName("IX_MealConsumption_Date_Schedule_Status")
            .IncludeProperties(x => x.MonthlyAllowanceId);

        // Order integration queries
        builder
            .HasIndex(x => new { x.OrderId, x.ConsumptionDate })
            .HasDatabaseName("IX_MealConsumption_Order_Date")
            .HasFilter("OrderId IS NOT NULL");

        // Status-based queries for reporting
        builder
            .HasIndex(x => new { x.Status, x.ConsumptionDate })
            .HasDatabaseName("IX_MealConsumption_Status_Date")
            .IncludeProperties(x => new { x.MonthlyAllowanceId, x.Amount, x.SubsidyAmount });
    }
}

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
