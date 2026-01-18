namespace Sales.Application.Dtos;

public class SuscripcionDetalleDto
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
    public string? LicenciaDetalleName { get; set; }
}

public class SubscriptionResponse
{
    public int Id { get; set; }
    public int SubscriptionTypeId { get; set; }
    public int CompanyId { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string MaxPaymentDate { get; set; } = string.Empty;
    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }
    public bool? Paid { get; set; }
    public string? WarningMessage { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public int? CreatedByUserId { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? UpdatedAt { get; set; }
    public string? SubscriptionTypeName { get; set; }
    public string? CompanyName { get; set; }
    public ICollection<SuscripcionDetalleDto> SuscripcionDetalles { get; set; } = [];
}