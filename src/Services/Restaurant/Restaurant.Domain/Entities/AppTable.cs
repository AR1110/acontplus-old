namespace Restaurant.Domain.Entities;

[Table("Table", Schema = "Restaurant")]
public class AppTable : BaseEntity
{
    public required Room Room { get; set; }
    public int RoomId { get; set; }

    [Required] public int NumberTable { get; set; }

    [Required][MaxLength(100)] public required string Description { get; set; }

    [Required] public int Capacity { get; set; }

    public bool? Assigned { get; set; }
}
