namespace Restaurant.Application.DTOs.MealManagement;

public record CreateMealScheduleSettingRequest(
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    int CreatedByUserId);

public record UpdateMealScheduleSettingRequest(int Id,
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    bool IsActive,
    int UpdatedByUserId);

public record MealScheduleSettingResponse(int Id,
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    bool IsActive);
