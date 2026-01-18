namespace Configuration.Domain.Entities;

[Table("CompanyDemoStep", Schema = "Config")]
public class CompanyDemoStep : BaseEntity
{
    public required DemoStep DemoStep { get; set; }
    public int DemoStepId { get; set; }
    public required Company Company { get; set; }
    public Guid Uuid { get; set; }
}
