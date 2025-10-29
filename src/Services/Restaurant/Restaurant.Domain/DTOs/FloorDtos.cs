namespace Restaurant.Domain.DTOs;

public record CreateFloorDto();
public record UpdateFloorDto();
public record FloorResponseDto
{
    public int Id { get; set; }
    public string CodEstab { get; set; }
    public int EstablecimientoId { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public ICollection<RoomResponseDto>? Rooms { get; set; } = new List<RoomResponseDto>();
}

