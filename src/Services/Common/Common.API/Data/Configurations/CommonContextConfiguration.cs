using Common.API.Entities;
using Common.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.API.Data.Configurations;

public class MaritalStatusConfiguration : BaseEntityTypeConfiguration<MaritalStatus>
{
    public override void Configure(EntityTypeBuilder<MaritalStatus> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_MaritalStatus_Code")
            .IsUnique();
    }
}

public class HousingTypeConfigurations: BaseEntityTypeConfiguration<HousingType>
{
    public override void Configure(EntityTypeBuilder<HousingType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_HousingType_Code")
            .IsUnique();
    }
}
