namespace Identity.Api.Entities;

[Table("ScheduleCompany", Schema = "Seguridad")]
public class ScheduleCompany : BaseEntity
{
    /// <summary>
    /// FK to Common.Schedule - navigation removed for cross-service boundary
    /// </summary>
    public int ScheduleId { get; set; }

    /// <summary>
    /// FK to Config.Company - navigation removed for cross-service boundary
    /// </summary>
    public int CompanyId { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan StartTime { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan EndTime { get; set; }
}
