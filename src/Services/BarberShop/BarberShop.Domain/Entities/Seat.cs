namespace BarberShop.Domain.Entities;

public class Seat : BaseEntity
{
    public int SeatNumber { get; set; }

    [Required][MaxLength(10)] public required string Code { get; set; }

    [Required][MaxLength(50)] public required string Name { get; set; }

    [MaxLength(300)] public string? Description { get; set; }

    public bool IsOccupied { get; set; }

    public ICollection<Ticket>? Tickets { get; set; }
}
