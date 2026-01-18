namespace Sales.Domain.Entities;

[Table("SuscripcionDetalle", Schema = "Sales")]
public class SuscripcionDetalle : BaseEntity
{
    /// <summary>
    /// FK to Config.LicenseDetails - navigation removed for cross-service boundary
    /// </summary>
    public int LicenciaDetalleId { get; set; }

    public required Suscripcion Suscripcion { get; set; }
    public int SuscripcionId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime MaxPaymentDate { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Cost { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Tax { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Total { get; set; }

    public bool? Paid { get; set; }
}
