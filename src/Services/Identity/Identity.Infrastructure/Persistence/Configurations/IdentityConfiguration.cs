namespace Identity.Infrastructure.Persistence.Configurations;

public class ActionsConfiguration : BaseEntityTypeConfiguration<Actions>
{
    public override void Configure(EntityTypeBuilder<Actions> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Actions_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PolicyTypeConfiguration : BaseEntityTypeConfiguration<PolicyType>
{
    public override void Configure(EntityTypeBuilder<PolicyType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .IsUnique()
            .HasDatabaseName("IX_PolicyType_Code");

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenseAccessesConfiguration : BaseEntityTypeConfiguration<LicenseAccesses>
{
    public override void Configure(EntityTypeBuilder<LicenseAccesses> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.LicenseAccessDetails)
            .WithOne(m => m.LicenseAccess)
            .HasForeignKey(m => m.LicenseAccessId)
            .IsRequired();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenseAccessDetailsConfiguration : BaseEntityTypeConfiguration<LicenseAccessDetails>
{
    public override void Configure(EntityTypeBuilder<LicenseAccessDetails> builder)
    {
        base.Configure(builder);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
    }
}

public class RoleConfiguration : BaseEntityTypeConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Role_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class FeaturePolicyAccessConfiguration : BaseEntityTypeConfiguration<FeaturePolicyAccess>
{
    public override void Configure(EntityTypeBuilder<FeaturePolicyAccess> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.FeaturePolicyConfigurationId)
            .HasDatabaseName("IX_FeaturePolicyAccess_FeaturePolicyConfigurationId");

        builder.Property(x => x.AccessReason)
            .HasMaxLength(50)
            .IsUnicode(false);

        builder.Property(x => x.AllowedDays)
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(x => x.Notes)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Ignore(x => x.IsAccessExpired);
        builder.Ignore(x => x.IsTimeAllowed);
        builder.Ignore(x => x.IsDayAllowed);
        builder.Ignore(x => x.RemainingUserConsumption);
        builder.Ignore(x => x.IsUserConsumptionLimitReached);
        builder.Ignore(x => x.IsTimeRestricted);
        builder.Ignore(x => x.IsDayRestricted);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PolicyConfigurationAuditConfiguration : BaseEntityTypeConfiguration<PolicyConfigurationAudit>
{
    public override void Configure(EntityTypeBuilder<PolicyConfigurationAudit> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.PolicyTypeId)
            .HasDatabaseName("IX_PolicyConfigurationAudit_PolicyTypeId");

        builder.HasIndex(x => x.CompanyId)
            .HasDatabaseName("IX_PolicyConfigurationAudit_CompanyId");

        builder.Property(x => x.ChangeType)
            .HasMaxLength(50)
            .IsUnicode(false);

        builder.Property(x => x.OldValue)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Property(x => x.NewValue)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Property(x => x.ChangeReason)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PolicyEnforcementLogConfiguration : BaseEntityTypeConfiguration<PolicyEnforcementLog>
{
    public override void Configure(EntityTypeBuilder<PolicyEnforcementLog> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.CompanyId)
            .HasDatabaseName("IX_PolicyEnforcementLog_CompanyId");

        builder.HasIndex(x => x.PolicyTypeId)
            .HasDatabaseName("IX_PolicyEnforcementLog_PolicyTypeId");

        builder.HasIndex(x => new { x.CompanyId, x.PolicyTypeId })
            .HasDatabaseName("IX_PolicyEnforcementLog_Company_PolicyType");

        builder.Property(x => x.RequestedValue)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Property(x => x.AllowedValue)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Property(x => x.ActionTaken)
            .HasMaxLength(50)
            .IsUnicode(false);

        builder.Property(x => x.ResourceType)
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(x => x.ResourceId)
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(x => x.AdditionalContext)
            .IsUnicode(false);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PricingPlanAccessConfiguration : BaseEntityTypeConfiguration<PricingPlanAccess>
{
    public override void Configure(EntityTypeBuilder<PricingPlanAccess> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.PricingPlanId)
            .HasDatabaseName("IX_PricingPlanAccess_PricingPlanId");

        builder.HasIndex(x => x.RoleId)
            .HasDatabaseName("IX_PricingPlanAccess_RoleId");

        builder
            .HasMany(x => x.PricingPlanAccessDetails)
            .WithOne(m => m.PricingPlanAccess)
            .HasForeignKey(m => m.PricingPlanAccessId)
            .IsRequired();

        builder.Property(x => x.Notes)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class PricingPlanAccessDetailConfiguration : BaseEntityTypeConfiguration<PricingPlanAccessDetail>
{
    public override void Configure(EntityTypeBuilder<PricingPlanAccessDetail> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.MenuId)
            .HasDatabaseName("IX_PricingPlanAccessDetail_MenuId");

        builder.Property(x => x.Actions)
            .HasMaxLength(1000)
            .IsUnicode(false);

        builder.Property(x => x.Description)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
    }
}
