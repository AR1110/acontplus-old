using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Restaurant.Core.Entities
{
    [Table("OrderDocument", Schema = "Restaurant")]
    public class OrderDocument : BaseEntity
    {
        public Order Order { get; set; }
        public int OrderId { get; set; }
        public int? DocumentoId { get; set; }
        public int TipoDocumentoId { get; set; }
    }
}
