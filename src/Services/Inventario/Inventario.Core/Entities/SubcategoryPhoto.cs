using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Common.Core.Entities;

namespace Inventario.Core.Entities
{
    [Table("SubcategoryPhoto", Schema = "Inventario")]
    public class SubcategoryPhoto : BaseEntity
    {
        public int SubcategoryId { get; set; }
        [Required]
        [MaxLength(500)]
        public string S3ObjectKey { get; set; }
        [Required]
        [MaxLength(800)]
        public string S3ObjectUrl { get; set; }
        public bool IsDefault { get; set; }
    }
}
