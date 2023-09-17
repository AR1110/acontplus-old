using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("Menu", Schema = "Restaurant")]
    public class Menu : BaseEntity
    {
        public int ProductId { get; set; }
        [Required]
        [MaxLength(500)]
        public string Title { get; set; }
        [MaxLength(500)]
        public string Summary { get; set; }
        public MenuType MenuType { get; set; }
        public int? MenuTypeId { get; set; }
        public string Content { get; set; }
        public string PromotionDays { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<MenuItem> MenuItems { get; set; }
    }
}
