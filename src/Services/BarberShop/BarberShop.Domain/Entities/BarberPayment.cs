namespace BarberShop.Domain.Entities;

[Table("BarberPayment", Schema = "BarberShop")]
public class BarberPayment : BaseEntity
{
    public DateTime PaymentDate { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal Amount { get; set; }

    [MaxLength(100)] public string PaymentMethod { get; set; }

    [MaxLength(200)] public string Comments { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal BalanceForward { get; set; }

    // Relaciones
    public int BarberId { get; set; }
    public virtual Barber Barber { get; set; }

    public int SessionId { get; set; }
    public virtual WorkSession Session { get; set; }
}