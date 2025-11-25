namespace BarberShop.Domain.Entities;

public class BarberPayment : BaseEntity
{
    public DateTime PaymentDate { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal Amount { get; set; }

    public int FormaPagoId { get; set; }

    [MaxLength(500)] public string? S3ObjectKey { get; set; }

    [MaxLength(800)] public string? S3ObjectUrl { get; set; }

    [MaxLength(300)] public string? Comments { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal BalanceForward { get; set; }

    public int WorkSessionId { get; set; }
    public required WorkSession WorkSession { get; set; }
}
