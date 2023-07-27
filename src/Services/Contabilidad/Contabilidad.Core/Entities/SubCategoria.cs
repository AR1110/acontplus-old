using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contabilidad.Core.Entities
{
    [Table("SubCategoria", Schema = "Contabilidad")]
    public class SubCategoria : BaseEntity
    {
        public Tipo Tipo { get; set; }
        public int TipoId { get;set; }

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
