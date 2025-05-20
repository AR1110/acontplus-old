using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FactElect.Infrastructure.Data.Config;

public class CustomerConfiguration : BaseEntityTypeConfiguration<AppCustomer>
{
    public override void Configure(EntityTypeBuilder<AppCustomer> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.IdCard)
            .HasDatabaseName("UX_Customer_IdCard")
            .IsUnique();
    }
}