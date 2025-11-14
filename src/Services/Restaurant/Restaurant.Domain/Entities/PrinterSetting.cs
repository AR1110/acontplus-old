namespace Restaurant.Domain.Entities;

[Table("PrinterSetting", Schema = "Restaurant")]
public class PrinterSetting : BaseEntity
{
    public int PrinterId { get; set; }
    public required ProductionArea ProductionArea { get; set; }
    public int ProductionAreaId { get; set; }
    public short Copies { get; set; }
}
