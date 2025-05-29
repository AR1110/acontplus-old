namespace BarberShop.Domain.Entities;

[Table("TicketDocument", Schema = "BarberShop")]
public class TicketDocument : BaseEntity
{
    public int TicketId { get; set; }
    public required Ticket Ticket { get; set; }
    public int? DocumentoId { get; set; }
    public int TipoDocumentoId { get; set; }
}
