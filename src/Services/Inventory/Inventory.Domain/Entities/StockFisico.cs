namespace Inventory.Domain.Entities;

[Table("StockFisico", Schema = "Inventario")]
public class StockFisico : BaseEntity
{
    [MaxLength(15)] public required string CodEstab { get; set; }

    public int PuntoEmisionId { get; set; }
    public int Secuencial { get; set; }

    [MaxLength(18)] public required string SerieDocumento { get; set; }

    public DateTime Fecha { get; set; }

    [MaxLength(300)] public required string Responsable { get; set; }

    [MaxLength(500)] public string? Obs { get; set; }

    public DateTime? FechaRevision { get; set; }
    public ICollection<StockFisicoDetalle> StockFisicoDetalles { get; set; } = [];
}
