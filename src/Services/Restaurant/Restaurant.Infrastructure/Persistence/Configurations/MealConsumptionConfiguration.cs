using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations;

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

        // New: Relationship to CompanyCustomerMealPlan
        builder
            .HasOne(x => x.CompanyCustomerMealPlan)
            .WithMany(x => x.MealConsumptions)
            .HasForeignKey(x => x.CompanyCustomerMealPlanId)
            .OnDelete(DeleteBehavior.Restrict);

        // Order integration queries
        builder
            .HasIndex(x => new { x.OrderId, x.ConsumptionDate })
            .HasDatabaseName("IX_MealConsumption_Order_Date")
            .HasFilter("OrderId IS NOT NULL");

        // Status-based queries for reporting
        builder
            .HasIndex(x => new { x.Status, x.ConsumptionDate })
            .HasDatabaseName("IX_MealConsumption_Status_Date")
            .IncludeProperties(x => new { x.CompanyCustomerMealPlanId, x.Amount, x.SubsidyAmount });

        // New: Critical for limit checks and monthly aggregations (replaces old MonthlyAllowanceId index)
        builder
            .HasIndex(x => new { x.CompanyCustomerMealPlanId, x.ConsumptionDate })
            .HasDatabaseName("IX_MealConsumption_Plan_Date")
            .IncludeProperties(x => new { x.Status, x.Amount, x.SubsidyAmount, x.CompanyCustomerPayment });

        // New: For cancellation audits
        builder
            .HasIndex(x => new { x.Status, x.CancelledAt })
            .HasDatabaseName("IX_MealConsumption_Status_Cancelled")
            .HasFilter("CancelledAt IS NOT NULL")
            .IncludeProperties(x => new { x.CancellationReason, x.CancelledByUserId });

        // Decimal precision
        builder.Property(x => x.Amount).HasPrecision(10, 2);
        builder.Property(x => x.SubsidyAmount).HasPrecision(10, 2);
        builder.Property(x => x.CompanyCustomerPayment).HasPrecision(10, 2);
    }
}
