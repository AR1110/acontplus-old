namespace Configuration.Domain.Entities;

[Table("LicenseDetails", Schema = "Config")]
public class LicenseDetails : BaseEntity
{
    public required Licenses License { get; set; }
    public int LicenciaId { get; set; }
    public required Applications Application { get; set; }
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
