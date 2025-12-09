namespace BarberShop.Application.Tickets.Dtos;

public class TicketDto
{
    public int Id { get; init; }
    public int PuntoEmisionId { get; init; }
    public int Sequence { get; init; }
    public string Serie { get; init; }
    public string Status { get; init; }
    public string? Obs { get; init; }
    public decimal SubTotal { get; init; }
    public decimal? Discount { get; init; }
    public decimal Total { get; init; }
    public bool? BirthdayDiscount { get; init; }
    public bool? LoyaltyDiscount { get; init; }
    public int SeatId { get; init; }
    public string SeatName { get; init; }
    public int? CustomerId { get; init; }
    public int? WorkSessionId { get; init; }
    public DateTime CreatedAt { get; init; }
    public int CreatedByUserId { get; set; }
    public int UpdatedByUserId { get; set; }
    public List<TicketDetailDto> Details { get; init; } = [];
}
