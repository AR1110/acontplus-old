namespace Configuration.Domain.Entities;

[Table("PrinterDocument", Schema = "Config")]
public class PrinterDocument : BaseEntity
{
  public Printer Printer { get; set; }
  public int PrinterId { get; set; }

  [MaxLength(3)] public required string CodDoc { get; set; }

  public int Copies { get; set; }
}
