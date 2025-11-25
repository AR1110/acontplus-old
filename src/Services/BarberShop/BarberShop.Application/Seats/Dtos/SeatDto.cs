namespace BarberShop.Application.Seats.Dtos;

public class SeatDto
{
    public int Id { get; set; }
    public int SeatNumber { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int CreatedByUserId { get; set; }
    public int UpdatedByUserId { get; set; }
}
