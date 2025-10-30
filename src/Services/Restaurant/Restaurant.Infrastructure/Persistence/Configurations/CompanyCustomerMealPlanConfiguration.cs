using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Restaurant.Domain.Entities.MealManagement;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public class CompanyCustomerMealPlanConfiguration : BaseEntityTypeConfiguration<CompanyCustomerMealPlan>
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

        // New: Inverse relationship for MealConsumptions (one-to-many)
        builder
            .HasMany(x => x.MealConsumptions)
            .WithOne(x => x.CompanyCustomerMealPlan)
            .HasForeignKey(x => x.CompanyCustomerMealPlanId)
            .OnDelete(DeleteBehavior.Restrict);  // Prevent deleting plans with consumptions

        // ✅ OPTIMIZED INDEXES FOR HIGH WORKLOAD

        // Historical assignment tracking
        builder
            .HasIndex(x => new { x.CompanyCustomerId, x.MealPlanId, x.StartDate })
            .HasDatabaseName("IX_CompanyCustomerMealPlan_Customer_Plan_StartDate");

        // Customer-based active plan lookup (assuming IsActive is computed; include override for limits)
        builder
            .HasIndex(x => new { x.CompanyCustomerId })  // Simplified from previous (removed IsActive if not stored)
            .HasDatabaseName("IX_CompanyCustomerMealPlan_Customer")
            .IncludeProperties(x => new { x.MealPlanId, x.StartDate, x.EndDate, x.MonthlyAllocatedMealsOverride });

        // New: For limit overrides and aggregations
        builder
            .HasIndex(x => x.MonthlyAllocatedMealsOverride)
            .HasDatabaseName("IX_CompanyCustomerMealPlan_Override")
            .HasFilter("MonthlyAllocatedMealsOverride IS NOT NULL");
    }
}
