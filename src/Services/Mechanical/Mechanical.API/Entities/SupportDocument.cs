using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.API.Entities
{
    [Table("SupportDocument", Schema = "Mechanical")]
    public class SupportDocument : BaseEntity
    {
        public Support Support { get; set; }
        public int SupportId { get; set; }
        public int DocumentoId { get; set; }
        public int TipoDocumentoId { get; set; }

        [Required]
        [MaxLength(50)]
        public string SeriesVoucher { get; set; }
    }
}
