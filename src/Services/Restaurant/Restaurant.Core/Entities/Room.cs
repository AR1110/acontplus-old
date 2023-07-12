using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Room", Schema = "Restaurant")]
    public class Room : BaseEntity
    {
        public Floor floor { get; set; }
        public int FloorId { get; set; }

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
