namespace Restaurant.Domain.Dtos;

public record FloorCreate
{
  [MaxLength(50)] public required string CodEstab { get; init; }
  public int EstablecimientoId { get; init; }
  [MaxLength(5)] public required string Code { get; init; }
  [MaxLength(50)] public required string Description { get; init; }
  public int Capacity { get; init; }
};

public record FloorUpdate
{
  [MaxLength(50)] public required string CodEstab { get; init; }
  public int EstablecimientoId { get; init; }
  [MaxLength(5)] public required string Code { get; init; }
  [MaxLength(50)] public required string Description { get; init; }
  public int Capacity { get; init; }
};

public record FloorItem
{
  public int Id { get; init; }
  public required string CodEstab { get; init; }
  public int EstablecimientoId { get; init; }
  public required string Code { get; init; }
  public required string Description { get; init; }
  public int Capacity { get; init; }
  public bool IsActive { get; init; }
}
