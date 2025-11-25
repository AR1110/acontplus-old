namespace BarberShop.Application.Tickets.Dtos;

public class TicketDetailDto
{
    public int Id { get; init; }
    public int LineNumber { get; init; }
    public string? Description { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal Discount { get; init; }
    public decimal SubTotal { get; init; }
    public decimal Total { get; init; }
}
