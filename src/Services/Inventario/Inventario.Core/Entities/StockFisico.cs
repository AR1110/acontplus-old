using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Core.Entities
{
    [Table("StockFisico", Schema = "Inventario")]
    public class StockFisico : BaseEntity
    {
        [Required]
        [MaxLength(15)]
        public string CodEstab { get; set; }
        public int PuntoEmisionId { get; set; }
        [Required]
        [MaxLength(15)]
        public string Secuencial { get; set; }
        public DateTime Fecha { get; set; }
        [Required]
        [MaxLength(300)]
        public string Responsable { get; set; }
        [MaxLength(500)]
        public string Obs { get; set; }
        public DateTime? FechaRevision { get; set; }
        public int? UserId { get; set; }
        public List<StockFisicoDetalle> StockFisicoDetalles { get; set; }
    }
}
