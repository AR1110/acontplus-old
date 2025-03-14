namespace Configuracion.Domain.Entities;

[Table("PrinterDocument", Schema = "Config")]
public class PrinterDocument : BaseEntity
{
    public Printer Printer { get; set; }
    public int PrinterId { get; set; }

    [Required][MaxLength(3)] public string CodDoc { get; set; }

    public int Copies { get; set; }
}
