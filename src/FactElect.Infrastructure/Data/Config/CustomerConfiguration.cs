using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FactElect.Infrastructure.Data.Config;

public class CustomerConfiguration : IEntityTypeConfiguration<AppCustomer>
{
    public void Configure(EntityTypeBuilder<AppCustomer> builder)
    {
        builder.ToTable("Customer", "Customer");

        builder.Property(b => b.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(b => b.Enabled)
            .HasDefaultValueSql("1");

        //unique index -> not unique constraint
        builder.HasIndex(x => x.IdCard)
            .HasDatabaseName("UXC_Customer_IDCard")
            .IsUnique();
    }
}
