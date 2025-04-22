namespace BarberShop.Domain.Entities;

[Table("Ticket", Schema = "BarberShop")]
public class Ticket : BaseEntity
{
    public int PuntoEmisionId { get; set; }
    public int Sequence { get; set; }
    [Required][MaxLength(18)] public string Serie { get; set; }

    public TicketStatus Status { get; set; }

    [MaxLength(500)] public string Obs { get; set; }

    [Column(TypeName = "numeric(18,5)")] public decimal SubTotal { get; set; }

    [Column(TypeName = "numeric(18,5)")] public decimal? Discount { get; set; }

    [Column(TypeName = "numeric(18,5)")] public decimal Total { get; set; }

    // Para bonificaciones por fidelización
    public bool? BirthdayDiscount { get; set; }
    public bool? LoyaltyDiscount { get; set; }

    // Relaciones
    public int SeatId { get; set; }
    public Seat Seat { get; set; }

    public int? CustomerId { get; set; }

    public int? WorkSessionId { get; set; }
    public WorkSession WorkSession { get; set; }

    public ICollection<TicketDetail> TicketDetails { get; set; }
    public ICollection<TicketDocument> TicketDocuments { get; set; }
}
