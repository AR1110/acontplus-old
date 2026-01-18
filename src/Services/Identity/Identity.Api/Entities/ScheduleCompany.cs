namespace Identity.Api.Entities;

[Table("ScheduleCompany", Schema = "Seguridad")]
public class ScheduleCompany : BaseEntity
{
    public required Schedule Schedule { get; set; }
    public int ScheduleId { get; set; }
    public required Company Company { get; set; }
    public int CompanyId { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan StartTime { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan EndTime { get; set; }
}