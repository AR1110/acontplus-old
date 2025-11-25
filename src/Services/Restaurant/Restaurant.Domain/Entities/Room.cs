namespace Restaurant.Domain.Entities;

[Table("Room", Schema = "Restaurant")]
public class Room : BaseEntity
{
    public required Floor Floor { get; set; }
    public int FloorId { get; set; }

    [Required] [MaxLength(5)] public required string Code { get; set; }

    [Required] [MaxLength(50)] public required string Description { get; set; }

    [Required] public int Capacity { get; set; }

    public ICollection<AppTable> Tables { get; set; } = [];
}
