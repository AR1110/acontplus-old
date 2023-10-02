using System.ComponentModel.DataAnnotations;
using Common.Core.Entities;

namespace TechnicalSupport.Core.Entities
{
    public class ProductType : BaseEntity
    {
        [Required]
        [MaxLength(8)]
        public string Code { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
    }
}
