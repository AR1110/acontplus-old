namespace BarberShop.Application.Tickets.DTOs;

public record TicketDto
{
    public int Id { get; init; }
    public int PuntoEmisionId { get; init; }
    public int Sequence { get; init; }
    public string Serie { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string? Obs { get; init; }
    public decimal SubTotal { get; init; }
    public decimal? Discount { get; init; }
    public decimal Total { get; init; }
    public bool? BirthdayDiscount { get; init; }
    public bool? LoyaltyDiscount { get; init; }
    public int SeatId { get; init; }
    public string SeatName { get; init; } = string.Empty;
    public int? CustomerId { get; init; }
    public int? WorkSessionId { get; init; }
    public DateTime CreatedAt { get; init; }
    public List<TicketDetailDto> Details { get; init; } = [];
}