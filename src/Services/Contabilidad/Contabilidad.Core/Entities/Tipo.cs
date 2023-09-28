using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Contabilidad.Core.Entities
{
    [Table("Tipo", Schema = "Contabilidad")]
    public class Tipo : BaseEntity
    {
        [Required]
        [MaxLength(10)]
        public string Codigo { get; set; }
        [Required]
        [MaxLength(150)]
        public string Descripcion { get; set; }
    }
}
