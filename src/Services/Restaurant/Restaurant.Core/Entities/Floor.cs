using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Floor", Schema = "Restaurant")]
    public class Floor : BaseEntity
    {
        [Required]
        public string EstabCod { get; set; }

        [Required]
        [MaxLength(5)]
        public string Code { get; set; }

        [Required]
        [MaxLength(50)]
        public string Description { get; set; }

        [Required]
        public int Capacity { get; set; }
    }
}
