using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Configuracion.API.Entities
{
    [Table("EstablecimientoLogo", Schema = "Config")]
    public class EstablecimientoLogo : BaseEntity
    {
        public int EstablecimientoId { get; set; }
        public byte[] Content { get; set; }
        [Required]
        [MaxLength(50)]
        public string ContentType { get; set; }
        [MaxLength(300)]
        public string FileName { get; set; }
        public bool? IsCompressed { get; set; }
    }
}
