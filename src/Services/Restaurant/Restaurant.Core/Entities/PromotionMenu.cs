using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.Core.Entities
{
    [Table("PromotionMenu", Schema = "Restaurant")]
    public class PromotionMenu : BaseEntity
    {
        public Promotion Promotion { get; set; }
        public int PromotionId { get; set; }
        public Menu Menu { get; set; }
        public int MenuId { get; set; }        
    }
}
