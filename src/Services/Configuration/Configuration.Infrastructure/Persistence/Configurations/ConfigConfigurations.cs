using Acontplus.Notifications.Entities;

namespace Configuration.Infrastructure.Persistence.Configurations;

public class AplicacionConfiguration : BaseEntityTypeConfiguration<Aplicacion>
{
    public override void Configure(EntityTypeBuilder<Aplicacion> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Aplicacion_Code")
            .IsUnique();

        builder
            .HasMany(x => x.Menus)
            .WithOne(x => x.Aplicacion)
            .HasForeignKey(x => x.AplicacionId);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class CompanyConfiguration : BaseEntityTypeConfiguration<Company>
{
    public override void Configure(EntityTypeBuilder<Company> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.IdCard)
            .HasDatabaseName("UX_Company_IdCard")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class DemoStepConfiguration : BaseEntityTypeConfiguration<DemoStep>
{
    public override void Configure(EntityTypeBuilder<DemoStep> builder)
    {
        base.Configure(builder);

        builder
            .Property(x => x.Mandatory)
            .HasDefaultValue(true);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class Ec2InstanceConfiguration : BaseEntityTypeConfiguration<Ec2Instance>
{
    public override void Configure(EntityTypeBuilder<Ec2Instance> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.InstanceId)
            .HasDatabaseName("UX_Ec2Instance_Id")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenciaConfiguration : BaseEntityTypeConfiguration<Licencia>
{
    public override void Configure(EntityTypeBuilder<Licencia> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Licencia_Code")
            .IsUnique();

        builder
            .HasMany(x => x.LicenciaDetalles)
            .WithOne(x => x.Licencia)
            .HasForeignKey(x => x.LicenciaId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenciaDetalleConfiguration : BaseEntityTypeConfiguration<LicenciaDetalle>
{
    public override void Configure(EntityTypeBuilder<LicenciaDetalle> builder)
    {
        base.Configure(builder);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenseTypeConfiguration : BaseEntityTypeConfiguration<LicenseType>
{
    public override void Configure(EntityTypeBuilder<LicenseType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_License_Type_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class MenuConfiguration : BaseEntityTypeConfiguration<Menu>
{
    public override void Configure(EntityTypeBuilder<Menu> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Menu_Code")
            .IsUnique();

        builder
            .HasOne(m => m.Parent)
            .WithMany(m => m.Children)
            .HasForeignKey(m => m.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class MenuActionConfiguration : BaseEntityTypeConfiguration<MenuAction>
{
    public override void Configure(EntityTypeBuilder<MenuAction> builder)
    {
        base.Configure(builder);

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

public class LicensePolicyConfigurations : BaseEntityTypeConfiguration<LicensePolicyConfiguration>
{
    public override void Configure(EntityTypeBuilder<LicensePolicyConfiguration> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(e => new { e.LicenseTypeId, e.PolicyTypeId })
            .IsUnique()
            .HasDatabaseName("IX_LicensePolicyConfiguration_LicenseType_Policy");

        builder
            .HasOne(e => e.LicenseType)
            .WithMany(e => e.LicensePolicyConfigurations)
            .HasForeignKey(e => e.LicenseTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(e => e.PolicyType)
            .WithMany(e => e.LicensePolicyConfigurations)
            .HasForeignKey(e => e.PolicyTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class CompanyPolicyOverrideConfiguration : BaseEntityTypeConfiguration<CompanyPolicyOverride>
{
    public override void Configure(EntityTypeBuilder<CompanyPolicyOverride> builder)
    {
        base.Configure(builder);
        builder
            .HasIndex(e => new { e.CompanyId, e.PolicyTypeId })
            .IsUnique()
            .HasDatabaseName("IX_CompanyPolicyOverride_Company_Policy");

        builder
            .HasOne(e => e.PolicyType)
            .WithMany(e => e.CompanyPolicyOverrides)
            .HasForeignKey(e => e.PolicyTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

//public class PolicyEnforcementLogConfiguration : BaseEntityTypeConfiguration<PolicyEnforcementLog>
//{
//    public override void Configure(EntityTypeBuilder<PolicyEnforcementLog> builder)
//    {
//        base.Configure(builder);

//        builder
//            .HasIndex(e => new { e.CompanyId, e.CreatedAt })
//            .HasDatabaseName("IX_PolicyEnforcementLog_Company_CreatedAt");

//        builder
//            .HasIndex(e => e.PolicyTypeId)
//            .HasDatabaseName("IX_PolicyEnforcementLog_PolicyType");

//        builder
//            .HasOne(e => e.PolicyType)
//            .WithMany()
//            .HasForeignKey(e => e.PolicyTypeId)
//            .OnDelete(DeleteBehavior.Restrict);

//        builder.Ignore(x => x.CreatedBy);
//        builder.Ignore(x => x.UpdatedBy);
//        builder.Ignore(x => x.DeletedBy);
//    }
//}

//public class PolicyConfigurationAuditConfiguration : BaseEntityTypeConfiguration<PolicyConfigurationAudit>
//{
//    public override void Configure(EntityTypeBuilder<PolicyConfigurationAudit> builder)
//    {
//        base.Configure(builder);

//        builder
//            .HasIndex(e => new { e.PolicyTypeId, e.CreatedAt })
//            .HasDatabaseName("IX_PolicyConfigurationAudit_Policy_CreatedAt");

//        builder
//            .HasOne(e => e.PolicyType)
//            .WithMany()
//            .HasForeignKey(e => e.PolicyTypeId)
//            .OnDelete(DeleteBehavior.Restrict);

//        builder.Ignore(x => x.CreatedBy);
//        builder.Ignore(x => x.UpdatedBy);
//        builder.Ignore(x => x.DeletedBy);
//    }
//}

public class SistemaConfiguration : BaseEntityTypeConfiguration<Sistema>
{
    public override void Configure(EntityTypeBuilder<Sistema> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Sistema_Code")
            .IsUnique();

        builder
            .HasMany(x => x.Aplicaciones)
            .WithOne(m => m.Sistema)
            .HasForeignKey(m => m.SistemaId);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class SubscriptionTypeConfiguration : BaseEntityTypeConfiguration<SubscriptionType>
{
    public override void Configure(EntityTypeBuilder<SubscriptionType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Subscription_Type_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class WhatsAppUsageConfiguration : BaseEntityTypeConfiguration<WhatsAppUsage>
{
    public override void Configure(EntityTypeBuilder<WhatsAppUsage> builder)
    {
        base.Configure(builder);

        builder
            .HasOne<Company>()
            .WithMany(c => c.WhatsAppUsages)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(x => x.CompanyId)
            .HasDatabaseName("UX_WhatsAppUsage_CompanyId")
            .IsUnique();

        builder
            .Property(x => x.Used)
            .HasDefaultValue(0);

        builder
            .Property(x => x.Limit)
            .HasDefaultValue(0);

        builder
            .Property(x => x.Unlimited)
            .HasDefaultValue(false);

        builder
            .Property(x => x.StartDate)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.ToTable("WhatsAppUsage", "Config");

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}
