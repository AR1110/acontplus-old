namespace BarberShop.Domain.Entities;

public class WorkSession : BaseEntity
{
    public int PuntoEmisionId { get; set; }

    public int UserBarberId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal TotalSales { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal TotalAdvances { get; set; }

    public ICollection<Ticket>? Tickets { get; set; }

    public ICollection<BarberPayment>? Payments { get; set; }
}
