namespace Restaurant.Domain.Entities;

[Table("Table", Schema = "Restaurant")]
public class AppTable : BaseEntity
{
  public required Room Room { get; set; }
  public int RoomId { get; set; }

  public required int NumberTable { get; set; }

  [MaxLength(100)] public required string Description { get; set; }

  public required int Capacity { get; set; }

  public bool? Assigned { get; set; }
}
