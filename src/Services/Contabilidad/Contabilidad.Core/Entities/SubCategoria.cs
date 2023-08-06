using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contabilidad.Core.Entities
{
    [Table("SubCategoria", Schema = "Contabilidad")]
    public class SubCategoria : BaseEntity
    {
        public Tipo Tipo { get; set; }
        public int TipoId { get; set; }

        public Categoria Categoria { get; set; }
        public int CategoriaId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Codigo { get; set; }

        [Required]
        [MaxLength(300)]
        public string Descripcion { get; set; }
        public int? IdUsuario { get; set; }
        public int IdEntidad { get; set; }

    }
}
