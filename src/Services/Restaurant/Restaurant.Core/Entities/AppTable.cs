using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Restaurant.Core.Entities
{

    [Table("Table", Schema = "Restaurant")]
    public class AppTable : BaseEntity
    {
        public Room Room { get; set; }
        public int RoomId { get; set; }
        [Required]
        public int NumberTable { get; set; }
        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
        [Required]
        public int Capacity { get; set; }
        public bool? Assigned { get; set; }
    }
}
