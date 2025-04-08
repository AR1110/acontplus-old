using FactElect.Domain.Entities.Sri;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FactElect.Infrastructure.Data.Config;

public class TipoComprobanteConfiguration : BaseEntityTypeConfiguration<TipoComprobante>
{
    public override void Configure(EntityTypeBuilder<TipoComprobante> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_TipoComprobante_Codigo")
            .IsUnique();
    }
}

public class SustentoTributarioConfiguration : BaseEntityTypeConfiguration<SustentoTributario>
{
    public override void Configure(EntityTypeBuilder<SustentoTributario> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_SustentoTributario_Codigo")
            .IsUnique();
    }
}

public class ImpuestoRetencionConfiguration : BaseEntityTypeConfiguration<ImpuestoRetencion>
{
    public override void Configure(EntityTypeBuilder<ImpuestoRetencion> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_ImpuestoRetencion_Codigo")
            .IsUnique();
    }
}

public class DocumentoSustentoTributarioConfiguration : BaseEntityTypeConfiguration<DocumentoSustentoTributario>
{
    public override void Configure(EntityTypeBuilder<DocumentoSustentoTributario> builder)
    {
        base.Configure(builder);

        builder
            .HasOne(dst => dst.TipoComprobante)
            .WithMany(tc=>tc.DocumentosSustentoTributario)
            .HasForeignKey(dst => dst.TipoComprobanteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(dst => dst.SustentoTributario)
            .WithMany(st => st.DocumentosSustentoTributario)
            .HasForeignKey(dst => dst.SustentoTributarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PaisConfiguration : BaseEntityTypeConfiguration<Pais>
{
    public override void Configure(EntityTypeBuilder<Pais> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_Pais_Codigo")
            .IsUnique();

        builder
            .HasMany(x => x.ParaisosFiscales)
            .WithOne(x => x.Pais)
            .HasForeignKey(x => x.PaisId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ParaisoFiscalConfiguration : BaseEntityTypeConfiguration<ParaisoFiscal>
{
    public override void Configure(EntityTypeBuilder<ParaisoFiscal> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_ParaisoFiscal_Codigo")
            .IsUnique();
    }
}

public class PorcentajeRetencionIvaConfiguration : BaseEntityTypeConfiguration<PorcentajeRetencionIva>
{
    public override void Configure(EntityTypeBuilder<PorcentajeRetencionIva> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_PorcentajeRetencionIva_Codigo")
            .IsUnique();
    }
}

public class TipoIdentificacionProveedorConfiguration : BaseEntityTypeConfiguration<TipoIdentificacionProveedor>
{
    public override void Configure(EntityTypeBuilder<TipoIdentificacionProveedor> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_TipoIdentificacionProveedor_Codigo")
            .IsUnique();
    }
}

public class TipoPagoConfiguration : BaseEntityTypeConfiguration<TipoPago>
{
    public override void Configure(EntityTypeBuilder<TipoPago> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_TipoPago_Codigo")
            .IsUnique();

        builder
            .HasMany(x => x.ConceptoRetenciones)
            .WithOne(x => x.TipoPago)
            .HasForeignKey(x => x.TipoPagoId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ConceptoRetencionAirConfiguration : BaseEntityTypeConfiguration<ConceptoRetencionAir>
{
    public override void Configure(EntityTypeBuilder<ConceptoRetencionAir> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_ConceptoRetencionAir_Codigo")
            .IsUnique();

        builder
            .HasMany(x => x.PorcentajeRetencionAirs)
            .WithOne(x => x.ConceptoRetencionAir)
            .HasForeignKey(x => x.ConceptoRetencionAirId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class TipoRegimenFiscalExteriorConfiguration : BaseEntityTypeConfiguration<TipoRegimenFiscalExterior>
{
    public override void Configure(EntityTypeBuilder<TipoRegimenFiscalExterior> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Codigo)
            .HasDatabaseName("UX_TipoRegimenFiscalExterior_Codigo")
            .IsUnique();
    }
}
