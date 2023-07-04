using Customer.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Customer.Infrastructure.Data.Config
{
    public class CustomerConfiguration : IEntityTypeConfiguration<AppCustomer>
    {
        public void Configure(EntityTypeBuilder<AppCustomer> builder)
        {
            builder.ToTable("Customer", schema: "Customer");
            //unique index -> not unique constraint
            builder.HasIndex(x => x.IDCard)
           .HasDatabaseName("UXC_Customer_IDCard")
           .IsUnique();
        }
    }
}
