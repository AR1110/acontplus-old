using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.API.Entities
{
    [Table("OrderDocument", Schema = "TechnicalSupport")]
    public class OrderDocument : BaseEntity
    {
        public Order Order { get; set; }
        public int OrderId { get; set; }
        public int? DocumentoId { get; set; }
        public int TipoDocumentoId { get; set; }
    }
}
