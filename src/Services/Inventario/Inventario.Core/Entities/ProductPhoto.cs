using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;
namespace Inventario.Core.Entities
{
    [Table("ProductPhoto", Schema = "Inventario")]
    public class ProductPhoto : BaseEntity
    {
        public int ProductId { get; set; }
        [Required]
        [MaxLength(500)]
        public string S3ObjectKey { get; set; }
        [Required]
        [MaxLength(800)]
        public string S3ObjectUrl { get; set; }
        public bool IsDefault { get; set; }
    }
}
