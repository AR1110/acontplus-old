using Customer.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;
using System.Reflection.Metadata;

namespace Customer.Infrastructure.Data.Config
{
    public class CustomerConfiguration : IEntityTypeConfiguration<AppCustomer>
    {
        public void Configure(EntityTypeBuilder<AppCustomer> builder)
        {
            builder.ToTable("Customer", schema: "Customer");

            builder.Property(b => b.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

            builder.Property(b => b.Enabled)
            .HasDefaultValueSql("1");

            //unique index -> not unique constraint
            builder.HasIndex(x => x.IDCard)
           .HasDatabaseName("UXC_Customer_IDCard")
           .IsUnique();
        }
    }
}
