namespace Common.Application.Dtos;

public record ScheduleCreate(
    int DayId,
    TimeSpan StartTime,
    TimeSpan EndTime
);

public record ScheduleUpdate(
    int DayId,
    TimeSpan StartTime,
    TimeSpan EndTime
);

public record ScheduleItem(
    int Id,
    int DayId,
    string DayName,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);