using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Domain.DTOs;

public record CreateTableDto();
public record UpdateTableDto();
public record TableResponseDto
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
}
