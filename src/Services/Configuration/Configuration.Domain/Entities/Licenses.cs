namespace Configuration.Domain.Entities;

[Table("Licenses", Schema = "Config")]
public class Licenses : BaseEntity
{
    [MaxLength(25)] public required string Code { get; set; }

    public required LicenseType LicenseType { get; set; }
    public int LicenseTypeId { get; set; }
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

    public ICollection<LicenseDetails> LicenseDetails { get; set; } = [];
}
