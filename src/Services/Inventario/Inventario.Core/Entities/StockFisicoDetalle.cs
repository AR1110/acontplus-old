using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Core.Entities
{
    [Table("StockFisicoDetalle", Schema = "Inventario")]
    public class StockFisicoDetalle : BaseEntity
    {
        public StockFisico StockFisico { get; set; }
        public int StockFisicoId { get; set; }
        public int BodegaId { get; set; }
        public int ArticuloId { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal CantidadContada { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal StockActual { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal? Discrepancia { get; set; }
        public MotivoDiscrepancia MotivoDiscrepancia { get; set; }
        public int? MotivoDiscrepanciaId { get; set; }
        [MaxLength(300)]
        public string OtroMotivo { get; set; }
    }
}