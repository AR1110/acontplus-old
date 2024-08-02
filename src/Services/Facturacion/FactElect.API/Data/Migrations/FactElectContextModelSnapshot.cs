using Microsoft.EntityFrameworkCore.Infrastructure;

namespace FactElect.API.Data.Migrations;

[DbContext(typeof(FactElectContext))]
internal class FactElectContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "7.0.8")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        modelBuilder.UseIdentityColumns();

        modelBuilder.Entity("FactElect.Entities.AppCustomer", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int");

            b.Property<int>("Id").UseIdentityColumn();

            b.Property<string>("Address")
                .IsRequired()
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnType("varchar(500)");

            b.Property<string>("BusinessName")
                .IsRequired()
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnType("varchar(300)");

            b.Property<DateTime>("CreatedAt")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasDefaultValueSql("GETDATE()");

            b.Property<bool?>("Deleted")
                .HasColumnType("bit");

            b.Property<string>("Email")
                .IsRequired()
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnType("varchar(500)");

            b.Property<bool?>("Enabled")
                .ValueGeneratedOnAdd()
                .HasColumnType("bit")
                .HasDefaultValueSql("1");

            b.Property<string>("IDCard")
                .IsRequired()
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnType("varchar(15)");

            b.Property<string>("IDType")
                .IsRequired()
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnType("varchar(2)");

            b.Property<bool?>("SriValidation")
                .HasColumnType("bit");

            b.Property<string>("Telephone")
                .IsRequired()
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnType("varchar(300)");

            b.Property<string>("TradeName")
                .IsRequired()
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnType("varchar(300)");

            b.Property<DateTime?>("UpdatedAt")
                .HasColumnType("datetime2");

            b.HasKey("Id");

            b.HasIndex("IDCard")
                .IsUnique()
                .HasDatabaseName("UXC_Customer_IDCard");

            b.ToTable("Customer", "Customer");
        });
#pragma warning restore 612, 618
    }
}
