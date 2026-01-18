namespace Configuration.Domain.Entities;

[Table("ScheduleCompany", Schema = "Config")]
public class ScheduleCompany : BaseEntity
{
    /// <summary>
    /// FK to Common.Schedule - navigation removed for cross-service boundary
    /// </summary>
    public int ScheduleId { get; set; }

    public required Company Company { get; set; }
    public int CompanyId { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan StartTime { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan EndTime { get; set; }
}
