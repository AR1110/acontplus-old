namespace Sales.Domain.Entities;

[Table("Suscripcion", Schema = "Sales")]
public class Suscripcion : BaseEntity
{
    /// <summary>
    /// FK to Config.SubscriptionType - navigation removed for cross-service boundary
    /// </summary>
    public int SubscriptionTypeId { get; set; }

    /// <summary>
    /// FK to Config.Company - navigation removed for cross-service boundary
    /// </summary>
    public int CompanyId { get; set; }
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

    [MaxLength(1500)] public string? WarningMessage { get; set; }

    public ICollection<SuscripcionDetalle> SuscripcionDetalles { get; set; } = [];
}
