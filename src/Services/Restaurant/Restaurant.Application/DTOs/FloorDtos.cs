namespace Restaurant.Application.Dtos;

public class FloorCreate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

public class FloorUpdate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

public class FloorItem
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<RoomItem> Rooms { get; set; }
}
