namespace BarberShop.Domain.Entities;

[Table("Seat", Schema = "BarberShop")]
public class Seat : BaseEntity
{
    public int SeatNumber { get; set; }

    [Required, MaxLength(10)] public string Code { get; set; }

    [Required][MaxLength(50)] public string Name { get; set; }

    [MaxLength(300)] public string Description { get; set; }

    public bool IsOccupied { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; }
}
