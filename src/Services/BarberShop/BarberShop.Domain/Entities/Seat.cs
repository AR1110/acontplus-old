namespace BarberShop.Domain.Entities;

[Table("Seat", Schema = "BarberShop")]
public class Seat : BaseEntity
{
    [Required] [MaxLength(50)] public string Name { get; set; }

    [MaxLength(300)] public string Description { get; set; }

    public bool IsOccupied { get; set; }

    // Relaciones
    public virtual ICollection<Ticket> Tickets { get; set; }
}