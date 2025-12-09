namespace BarberShop.Domain.Entities;

public class TicketDetail : BaseEntity
{
    public int TicketId { get; set; }
    public required Ticket Ticket { get; set; }

    public int? ProductId { get; set; }

    public int LineNumber { get; set; }

    [MaxLength(300)] public string? Description { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal Quantity { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal Discount { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal TaxRate { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal TaxAmount { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal SubTotal { get; set; }

    [Column(TypeName = "decimal(18,5)")] public decimal Total { get; set; }


    [MaxLength(500)] public string? Obs { get; set; }
}
