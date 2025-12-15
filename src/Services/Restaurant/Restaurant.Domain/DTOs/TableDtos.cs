namespace Restaurant.Domain.Dtos;

public record TableCreate
{
  public int RoomId { get; init; }
  public required int NumberTable { get; init; }
  [MaxLength(100)] public required string Description { get; init; }
  public required int Capacity { get; init; }
  public bool? Assigned { get; init; }
};

public record TableUpdate
{
  public int RoomId { get; init; }
  public required int NumberTable { get; init; }
  [MaxLength(100)] public required string Description { get; init; }
  public required int Capacity { get; init; }
  public bool? Assigned { get; init; }
};

public record TableItem
{
  public int Id { get; init; }
  public int RoomId { get; init; }
  public int NumberTable { get; init; }
  public required string Description { get; init; }
  public int Capacity { get; init; }
  public bool? Assigned { get; init; }
  public bool IsActive { get; init; }
}
