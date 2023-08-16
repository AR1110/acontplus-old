using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Core.Entities
{
    [Table("MotivoDiscrepancia", Schema = "Inventario")]
    public class MotivoDiscrepancia : BaseEntity
    {
        [Required]
        [MaxLength(10)]
        public string Codigo { get; set; }
        [Required]
        [MaxLength(150)]
        public string Descripcion { get; set; }
    }
}
