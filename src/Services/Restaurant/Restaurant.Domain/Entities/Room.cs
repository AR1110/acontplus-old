namespace Restaurant.Domain.Entities;

[Table("Room", Schema = "Restaurant")]
public class Room : BaseEntity
{
  public required Floor Floor { get; set; }
  public int FloorId { get; set; }

  [MaxLength(5)] public required string Code { get; set; }

  [MaxLength(50)] public required string Description { get; set; }

  public required int Capacity { get; set; }

  public ICollection<AppTable> Tables { get; set; } = [];
}
