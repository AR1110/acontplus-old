using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Configuracion.API.Entities
{
    [Table("Printer", Schema = "Config")]
    public class Printer : BaseEntity
    {
        public PrinterType PrinterType { get; set; }
        public int PrinterTypeId { get; set; }
        public int EstablecimientoId { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        [Required]
        [MaxLength(100)]
        public string IpAddress { get; set; }
        public bool IsDefault { get; set; }
        [Required]
        [MaxLength(150)]
        public string Machine { get; set; }
        public bool? ServerDevice { get; set; }
        [MaxLength(17)]
        public string MacAddress { get; set; }
        public List<PrinterDocument> Documents { get; set; }
    }
}
