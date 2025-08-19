namespace Restaurant.Domain.Entities;

[Table("Floor", Schema = "Restaurant")]
public class Floor : BaseEntity
{
    [Required][MaxLength(50)] public string CodEstab { get; set; }

    public int EstablecimientoId { get; set; }

    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(50)] public string Description { get; set; }

    public int Capacity { get; set; }
    public List<Room> Rooms { get; set; }
}