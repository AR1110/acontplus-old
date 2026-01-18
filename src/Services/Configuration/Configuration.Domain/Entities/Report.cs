namespace Configuration.Domain.Entities;

[Table("Reports", Schema = "Config")]
public class Report : BaseEntity
{
    [MaxLength(10)]
    public required string Code { get; set; }

    [MaxLength(250)]
    public required string FileName { get; set; }

    [MaxLength(250)]
    public required string ReportPath { get; set; }

    public string? Query { get; set; }

    public bool FromMobile { get; set; }

    public bool Enabled { get; set; } = true;

    public int? UserId { get; set; }
}
