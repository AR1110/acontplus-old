using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Configuracion.API.Entities
{
    [Table("PrinterType", Schema = "Config")]
    public class PrinterType : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [Required]
        [MaxLength(3)]
        public string Code { get; set; }
        [Required]
        [MaxLength (50)]
        public string Formato { get; set; }
        [Required]
        public string DeviceInfo { get; set; }
        public bool Thermal { get; set; }
    }
}
