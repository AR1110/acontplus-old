using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace TechnicalSupport.API.Entities
{
    [Table("Modelo", Schema = "TechnicalSupport")]
    public class Modelo : BaseEntity
    {
        public Brand Brand { get; set; }
        public int BrandId { get; set; }
        public Serie Serie { get; set; }
        public int? SerieId { get; set; }
        [Required]
        [MaxLength(8)]
        public string Code { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        public int? Year { get; set; }
    }
}
