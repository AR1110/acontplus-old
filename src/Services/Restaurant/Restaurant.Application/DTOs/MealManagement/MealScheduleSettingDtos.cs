namespace Restaurant.Application.DTOs.MealManagement;

public record MealScheduleSettingCreate(
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    int CreatedByUserId);

public record MealScheduleSettingUpdate(int Id,
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    bool IsActive,
    int UpdatedByUserId);

public record MealScheduleSettingItem(int Id,
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    bool IsActive);
