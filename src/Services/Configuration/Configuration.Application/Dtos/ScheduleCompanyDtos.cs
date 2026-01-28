namespace Configuration.Application.Dtos;

public class ScheduleCompanyItem
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public int ScheduleId { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}

public record ScheduleCompanyCreate(
    int CompanyId,
    int ScheduleId,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int? CreatedByUserId = null
);

public record ScheduleCompanyUpdate(
    int CompanyId,
    int ScheduleId,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsActive = true,
    int? UpdatedByUserId = null
);
