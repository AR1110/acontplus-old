namespace Restaurant.Domain.Entities;

[Table("OrderDocument", Schema = "Restaurant")]
public class OrderDocument : BaseEntity
{
    public required Order Order { get; set; }
    public int OrderId { get; set; }
    public int? DocumentoId { get; set; }
    public int TipoDocumentoId { get; set; }
}
