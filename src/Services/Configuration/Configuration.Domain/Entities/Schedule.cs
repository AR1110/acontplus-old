namespace Configuration.Domain.Entities;

[Table("Schedule", Schema = "Config")]
public class Schedule : BaseEntity
{
    public required Days Day { get; set; }
    public int DayId { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan StartTime { get; set; }

    [Column(TypeName = "TIME(7), NOT NULL")]
    public TimeSpan EndTime { get; set; }
}
