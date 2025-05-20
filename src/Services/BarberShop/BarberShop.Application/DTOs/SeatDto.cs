namespace BarberShop.Application.DTOs;

public class SeatDto : BaseDto
{
    public int Id { get; set; }
    public int SeatNumber { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}