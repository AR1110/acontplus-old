using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Domain.DTOs;

public record CreateRoomDto();
public record UpdateRoomDto();
public record RoomResponseDto
{

    public int Id { get; set; }
    public int FloorId { get; set; }
    public required string Code { get; set; }
    public required string Description { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public ICollection<TableResponseDto>? Tables { get; set; } = new List<TableResponseDto>();

}
