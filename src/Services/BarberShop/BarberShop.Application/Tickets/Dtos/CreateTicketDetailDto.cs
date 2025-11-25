namespace BarberShop.Application.Tickets.Dtos;

public record CreateTicketDetailDto
{
    public int? ProductId { get; init; }
    public string? Description { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal Discount { get; init; } = 0;
    public decimal TaxRate { get; init; } = 0;
    public string? Obs { get; init; }
}
