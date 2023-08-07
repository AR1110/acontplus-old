using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("ProductionArea", Schema = "Restaurant")]
    public class ProductionArea : BaseEntity
    {
        [Required]
        [MaxLength(5)]
        public string Code { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
    }
}
