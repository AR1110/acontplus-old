using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Vet.Infrastructure.Persistence.Configurations;

public class BehaviorConfiguration : BaseEntityTypeConfiguration<Behavior>
{
    public override void Configure(EntityTypeBuilder<Behavior> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Behavior_Code")
            .IsUnique();
    }
}

public class BehaviorStatusConfiguration : BaseEntityTypeConfiguration<BehaviorStatus>
{
    public override void Configure(EntityTypeBuilder<BehaviorStatus> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_BehaviorStatus_Code")
            .IsUnique();
    }
}

public class DiseaseConfiguratio : BaseEntityTypeConfiguration<Disease>
{
    public override void Configure(EntityTypeBuilder<Disease> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Disease_Code")
            .IsUnique();
    }
}

public class DiseaseStatusConfiguration : BaseEntityTypeConfiguration<DiseaseStatus>
{
    public override void Configure(EntityTypeBuilder<DiseaseStatus> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_DiseaseStatus_Code")
            .IsUnique();
    }
}

public class DiseaseTypeConfiguration : BaseEntityTypeConfiguration<DiseaseType>
{
    public override void Configure(EntityTypeBuilder<DiseaseType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_DiseaseType_Code")
            .IsUnique();
    }
}

public class MedicalHistoryConfiguration : BaseEntityTypeConfiguration<MedicalHistory>
{
    public override void Configure(EntityTypeBuilder<MedicalHistory> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(i => i.HealthChecks)
            .WithOne(d => d.MedicalHistory)
            .HasForeignKey(d => d.MedicalHistoryId);

        builder
            .HasMany(i => i.BehaviorTests)
            .WithOne(d => d.MedicalHistory)
            .HasForeignKey(d => d.MedicalHistoryId);
    }
}