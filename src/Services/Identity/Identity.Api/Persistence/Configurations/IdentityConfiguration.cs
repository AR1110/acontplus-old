using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StackExchange.Redis;

namespace Identity.Api.Persistence.Configurations;

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
            .HasForeignKey(m => m.LicenciaAccesoId)
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
