namespace Sales.Application.Dtos;

public class SuscripcionCreate
{
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
    public bool IsActive { get; set; } = true;

    public ICollection<SuscripcionDetalleCreate> SuscripcionDetalles { get; set; } =
        [];
}

public class SuscripcionDetalleCreate
{
    public int LicenciaDetalleId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime MaxPaymentDate { get; set; }
    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }
    public bool? Paid { get; set; }
}