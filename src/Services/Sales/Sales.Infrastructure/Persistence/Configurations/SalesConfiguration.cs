using Acontplus.Persistence.SqlServer.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sales.Domain.Entities;

namespace Sales.Infrastructure.Persistence.Configurations;

public class SuscripcionConfiguration : BaseEntityTypeConfiguration<Suscripcion>
{
    public override void Configure(EntityTypeBuilder<Suscripcion> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.SuscripcionDetalles)
            .WithOne(x => x.Suscripcion)
            .HasForeignKey(x => x.SuscripcionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class SuscripcionDetalleConfiguration : BaseEntityTypeConfiguration<SuscripcionDetalle>
{
    public override void Configure(EntityTypeBuilder<SuscripcionDetalle> builder)
    {
        base.Configure(builder);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PricingPlanConfiguration : BaseEntityTypeConfiguration<PricingPlan>
{
    public override void Configure(EntityTypeBuilder<PricingPlan> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_PricingPlan_Code")
            .IsUnique();

        builder
            .HasMany(x => x.PricingPlanFeatures)
            .WithOne(x => x.PricingPlan)
            .HasForeignKey(x => x.PricingPlanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.Subscriptions)
            .WithOne(x => x.PricingPlan)
            .HasForeignKey(x => x.PricingPlanId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Ignore(x => x.EffectivePrice);
        builder.Ignore(x => x.IsUnlimited);
        builder.Ignore(x => x.CanExtendTrial);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PricingPlanFeatureConfiguration : BaseEntityTypeConfiguration<PricingPlanFeature>
{
    public override void Configure(EntityTypeBuilder<PricingPlanFeature> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.FeaturePolicyConfigurations)
            .WithOne(x => x.PricingPlanFeature)
            .HasForeignKey(x => x.PricingPlanFeatureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.SubscriptionFeatures)
            .WithOne(x => x.PricingPlanFeature)
            .HasForeignKey(x => x.PricingPlanFeatureId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(x => x.FeatureUsages)
            .WithOne()
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasMany(x => x.ConsumptionTrackings)
            .WithOne()
            .OnDelete(DeleteBehavior.NoAction);

        builder.Ignore(x => x.EffectivePrice);
        builder.Ignore(x => x.IsUnlimited);
        builder.Ignore(x => x.HasOverage);
        builder.Ignore(x => x.IsCore);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class SubscriptionConfiguration : BaseEntityTypeConfiguration<Subscription>
{
    public override void Configure(EntityTypeBuilder<Subscription> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.CompanyId)
            .HasDatabaseName("IX_Subscription_CompanyId");

        builder
            .HasMany(x => x.SubscriptionFeatures)
            .WithOne(x => x.Subscription)
            .HasForeignKey(x => x.SubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.PlanChangeHistory)
            .WithOne(x => x.Subscription)
            .HasForeignKey(x => x.SubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.RenewalHistory)
            .WithOne(x => x.Subscription)
            .HasForeignKey(x => x.SubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.PreviousPricingPlan)
            .WithMany()
            .HasForeignKey(x => x.PreviousPricingPlanId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class SubscriptionFeatureConfiguration : BaseEntityTypeConfiguration<SubscriptionFeature>
{
    public override void Configure(EntityTypeBuilder<SubscriptionFeature> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.FeatureUsages)
            .WithOne(x => x.SubscriptionFeature)
            .HasForeignKey(x => x.SubscriptionFeatureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.ConsumptionTrackings)
            .WithOne(x => x.SubscriptionFeature)
            .HasForeignKey(x => x.SubscriptionFeatureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(x => x.EffectiveCost);
        builder.Ignore(x => x.EffectiveTaxRate);
        builder.Ignore(x => x.EffectiveDiscount);
        builder.Ignore(x => x.IsConsumptionBased);
        builder.Ignore(x => x.GetApplicationId);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class ConsumptionPackageConfiguration : BaseEntityTypeConfiguration<ConsumptionPackage>
{
    public override void Configure(EntityTypeBuilder<ConsumptionPackage> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_ConsumptionPackage_Code")
            .IsUnique();

        builder
            .HasMany(x => x.PricingPlanFeatures)
            .WithOne(x => x.ConsumptionPackage)
            .HasForeignKey(x => x.ConsumptionPackageId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Ignore(x => x.EffectivePrice);
        builder.Ignore(x => x.HasOverage);
        builder.Ignore(x => x.IsUnlimited);
        builder.Ignore(x => x.DisplayName);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class ConsumptionTrackingConfiguration : BaseEntityTypeConfiguration<ConsumptionTracking>
{
    public override void Configure(EntityTypeBuilder<ConsumptionTracking> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.SubscriptionFeatureId)
            .HasDatabaseName("IX_ConsumptionTracking_SubscriptionFeatureId");

        builder.Ignore(x => x.RemainingUsage);
        builder.Ignore(x => x.IsLimitReached);
        builder.Ignore(x => x.IsNearLimit);
        builder.Ignore(x => x.IsOverageActive);
        builder.Ignore(x => x.IsOverageLimitReached);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class CouponConfiguration : BaseEntityTypeConfiguration<Coupon>
{
    public override void Configure(EntityTypeBuilder<Coupon> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Coupon_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class FeaturePolicyConfigurationConfiguration : BaseEntityTypeConfiguration<FeaturePolicyConfiguration>
{
    public override void Configure(EntityTypeBuilder<FeaturePolicyConfiguration> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => new { x.PricingPlanFeatureId, x.PolicyTypeId })
            .HasDatabaseName("IX_FeaturePolicyConfiguration_Feature_Policy")
            .IsUnique();

        builder.Ignore(x => x.HasConsumptionLimit);
        builder.Ignore(x => x.HasWarningThreshkold);
        builder.Ignore(x => x.HasGracePeriod);
        builder.Ignore(x => x.IsAccessExpired);
        builder.Ignore(x => x.WarningLimit);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class FeatureUsageConfiguration : BaseEntityTypeConfiguration<FeatureUsage>
{
    public override void Configure(EntityTypeBuilder<FeatureUsage> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.SubscriptionFeatureId)
            .HasDatabaseName("IX_FeatureUsage_SubscriptionFeatureId");

        builder
            .HasIndex(x => x.UserId)
            .HasDatabaseName("IX_FeatureUsage_UserId");

        builder.Ignore(x => x.GetApplicationId);
        builder.Ignore(x => x.IsConsumptionBased);
        builder.Ignore(x => x.ConsumptionType);
        builder.Ignore(x => x.RemainingConsumption);
        builder.Ignore(x => x.IsLimitReached);
        builder.Ignore(x => x.IsNearLimit);
        builder.Ignore(x => x.HasOverage);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class SubscriptionPlanChangeHistoryConfiguration : BaseEntityTypeConfiguration<SubscriptionPlanChangeHistory>
{
    public override void Configure(EntityTypeBuilder<SubscriptionPlanChangeHistory> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.SubscriptionId)
            .HasDatabaseName("IX_SubscriptionPlanChangeHistory_SubscriptionId");

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class SubscriptionRenewalHistoryConfiguration : BaseEntityTypeConfiguration<SubscriptionRenewalHistory>
{
    public override void Configure(EntityTypeBuilder<SubscriptionRenewalHistory> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.SubscriptionId)
            .HasDatabaseName("IX_SubscriptionRenewalHistory_SubscriptionId");

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}
