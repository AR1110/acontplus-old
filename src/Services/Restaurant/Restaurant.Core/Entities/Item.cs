using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;


namespace Restaurant.Core.Entities
{
    [Table("Item", Schema = "Restaurant")]
    public class Item : BaseEntity
    {
        public int ProductId { get; set; }
        public ProductionArea ProductionArea { get; set; }
        public int? ProductionAreaId { get; set; }
        [MaxLength(500)]
        public string Summary { get; set; }
        public bool Cooking { get; set; }
        public string Recipe { get; set; }
        public string Instructions { get; set; }
        [MaxLength(500)]
        public string Content { get; set; }
    }
}
