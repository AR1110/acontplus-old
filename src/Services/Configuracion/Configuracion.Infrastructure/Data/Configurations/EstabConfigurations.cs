using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Configuracion.Infrastructure.Data.Configurations;

public class EstablecimientoLogoConfiguration : BaseEntityTypeConfiguration<EstablecimientoLogo>
{
    public override void Configure(EntityTypeBuilder<EstablecimientoLogo> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.EstablecimientoId)
            .HasDatabaseName("UX_EstabLogo_EstablecimientoId")
            .IsUnique();
    }
}

public class PrinterConfiguration : BaseEntityTypeConfiguration<Printer>
{
    public override void Configure(EntityTypeBuilder<Printer> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(i => i.Documents)
            .WithOne(d => d.Printer)
            .HasForeignKey(d => d.PrinterId);
    }
}

public class PrinterTypeConfiguration : BaseEntityTypeConfiguration<PrinterType>
{
    public override void Configure(EntityTypeBuilder<PrinterType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_PrinterType_Code")
            .IsUnique();
    }
}