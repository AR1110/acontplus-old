namespace Configuracion.Domain.Entities;

[Table("PrinterType", Schema = "Config")]
public class PrinterType : BaseEntity
{
    [Required] [MaxLength(100)] public string Name { get; set; }

    [Required] [MaxLength(3)] public string Code { get; set; }

    [Required] [MaxLength(50)] public string Formato { get; set; }

    [Required] public string DeviceInfo { get; set; }

    public bool Thermal { get; set; }
}