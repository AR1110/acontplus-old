namespace Inventory.Domain.Entities;

[Table("StockFisicoDetalle", Schema = "Inventario")]
public class StockFisicoDetalle : BaseEntity
{
    public required StockFisico StockFisico { get; set; }
    public int StockFisicoId { get; set; }
    public int BodegaId { get; set; }
    public int ArticuloId { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal CantidadContada { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal StockActual { get; set; }

    [Column(TypeName = "decimal(18,5)")]
    public decimal? Discrepancia { get; set; }

    public MotivoDiscrepancia? MotivoDiscrepancia { get; set; }
    public int? MotivoDiscrepanciaId { get; set; }

    [MaxLength(300)] public string? OtroMotivo { get; set; }
}
