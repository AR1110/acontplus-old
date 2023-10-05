using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    [Table("TechSpec", Schema = "TechnicalSupport")]
    public class TechSpec : BaseEntity
    {
        public Product Product { get; set; }
        public int ProductId { get; set; }
        [Required]
        public string Specs { get; set; }
    }
}
