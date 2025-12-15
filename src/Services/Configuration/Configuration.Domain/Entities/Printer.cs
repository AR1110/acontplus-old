namespace Configuration.Domain.Entities;

[Table("Printer", Schema = "Config")]
public class Printer : BaseEntity
{
  public required PrinterType PrinterType { get; set; }

  public int PrinterTypeId { get; set; }

  public int EstablecimientoId { get; set; }

  [MaxLength(150)] public required string Name { get; set; }

  [MaxLength(100)] public required string IpAddress { get; set; }


  [MaxLength(300)] public string? Domain { get; set; }

  public bool IsDefault { get; set; }

  [MaxLength(150)] public required string Machine { get; set; }

  public bool? ServerDevice { get; set; }

  [MaxLength(17)] public string? MacAddress { get; set; }

    public ICollection<PrinterDocument> Documents { get; set; } = [];
}
