namespace Restaurant.Domain.Entities;

[Table("Floor", Schema = "Restaurant")]
public class Floor : BaseEntity
{
  [MaxLength(50)] public required string CodEstab { get; set; }

  public int EstablecimientoId { get; set; }

  [MaxLength(5)] public required string Code { get; set; }

  [MaxLength(50)] public required string Description { get; set; }

  public int Capacity { get; set; }
  public ICollection<Room> Rooms { get; set; } = [];
}
