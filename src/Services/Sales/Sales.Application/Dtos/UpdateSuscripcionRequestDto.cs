namespace Sales.Application.Dtos;

public class SuscripcionUpdate
{
    public int Id { get; set; }
    public int SubscriptionTypeId { get; set; }
    public int CompanyId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime MaxPaymentDate { get; set; }
    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }
    public bool? Paid { get; set; }
    public string? WarningMessage { get; set; }
    public bool IsActive { get; set; }

    public ICollection<SuscripcionDetalleUpdate> SuscripcionDetalles { get; set; } =
        [];
}

public class SuscripcionDetalleUpdate
{
    public int Id { get; set; }
    public int LicenciaDetalleId { get; set; }
    public int SuscripcionId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime MaxPaymentDate { get; set; }
    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }
    public bool? Paid { get; set; }
}