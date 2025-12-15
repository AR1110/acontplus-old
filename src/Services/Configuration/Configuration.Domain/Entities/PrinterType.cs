namespace Configuration.Domain.Entities;

[Table("PrinterType", Schema = "Config")]
public class PrinterType : BaseEntity
{
  [MaxLength(100)] public required string Name { get; set; }

  [MaxLength(3)] public required string Code { get; set; }

  [MaxLength(50)] public required string Formato { get; set; }

  public required string DeviceInfo { get; set; }

  public bool Thermal { get; set; }
}
