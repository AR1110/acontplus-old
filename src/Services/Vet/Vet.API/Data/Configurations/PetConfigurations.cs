using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Vet.API.Data.Configurations;

public class BreedConfiguration : BaseEntityTypeConfiguration<Breed>
{
    public override void Configure(EntityTypeBuilder<Breed> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Breed_Code")
            .IsUnique();
    }
}

public class GenderConfiguration : BaseEntityTypeConfiguration<Gender>
{
    public override void Configure(EntityTypeBuilder<Gender> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Gender_Code")
            .IsUnique();
    }
}

public class PetTypeConfiguration : BaseEntityTypeConfiguration<PetType>
{
    public override void Configure(EntityTypeBuilder<PetType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_PetType_Code")
            .IsUnique();
    }
}
