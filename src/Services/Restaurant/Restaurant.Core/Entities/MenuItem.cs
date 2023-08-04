using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Restaurant.Core.Entities
{
    [Table("MenuItem", Schema = "Restaurant")]
    public class MenuItem : BaseEntity
    {
        public Menu Menu { get; set; }
        public int MenuId { get; set; }
        public Item Item { get; set; }
        public int ItemId { get; set; }
    }
}