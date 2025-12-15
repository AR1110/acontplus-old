namespace Restaurant.Domain.Dtos;

public record RoomCreate
{
  public int FloorId { get; init; }
  [MaxLength(5)] public required string Code { get; init; }
  [MaxLength(50)] public required string Description { get; init; }
  public required int Capacity { get; init; }
};

public record RoomUpdate
{
  public int FloorId { get; init; }
  [MaxLength(5)] public required string Code { get; init; }
  [MaxLength(50)] public required string Description { get; init; }
  public required int Capacity { get; init; }
};

public record RoomItem
{
  public int Id { get; init; }
  public int FloorId { get; init; }
  public required string Code { get; init; }
  public required string Description { get; init; }
  public int Capacity { get; init; }
  public bool IsActive { get; init; }
}
