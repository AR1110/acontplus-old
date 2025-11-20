namespace Restaurant.Application.Dtos;

public class RoomCreate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int FloorId { get; set; }
}

public class RoomUpdate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int FloorId { get; set; }
}

public class RoomItem
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int FloorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<TableItem> Tables { get; set; }
}
