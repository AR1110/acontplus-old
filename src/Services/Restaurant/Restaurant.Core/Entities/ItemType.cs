using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;


namespace Restaurant.Core.Entities
{
    [Table("ItemType", Schema = "Restaurant")]
    public class ItemType : BaseEntity
    {
        [Required]
        [MaxLength(5)]
        public string Code { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}
