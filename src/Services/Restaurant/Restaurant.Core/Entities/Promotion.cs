using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Restaurant.Core.Entities
{
    [Table("Promotion", Schema = "Restaurant")]
    public class Promotion : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string CodEstab { get; set; }
        [Required]
        [MaxLength(50)]
        public string Description { get; set; }
        public string PromotionDays { get; set; }
        [Required]
        public DateTime? StartDate { get; set; }
        [Required]
        public DateTime? EndDate { get; set; }
    }
}
