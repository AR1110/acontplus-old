namespace Restaurant.Application.Dtos;

public class TableCreate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public int RoomId { get; set; }
}

public class TableUpdate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public int RoomId { get; set; }
}

public class TableItem
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public int RoomId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}