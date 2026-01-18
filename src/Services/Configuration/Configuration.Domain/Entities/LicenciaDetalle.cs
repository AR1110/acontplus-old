namespace Configuration.Domain.Entities;

[Table("LicenciaDetalle", Schema = "Config")]
public class LicenciaDetalle : BaseEntity
{
    public required Licencia Licencia { get; set; }
    public int LicenciaId { get; set; }
    public required Aplicacion Aplicacion { get; set; }
    public int AplicacionId { get; set; }
    public int? TaxId { get; set; }
    public int? TaxPercentId { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Cost { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Tax { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Total { get; set; }
}