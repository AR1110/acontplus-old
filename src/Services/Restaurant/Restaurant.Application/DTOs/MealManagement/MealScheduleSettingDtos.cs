namespace Restaurant.Application.DTOs.MealManagement;

public record CreateMealScheduleSettingRequest(
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder);

public record UpdateMealScheduleSettingRequest(int Id,
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    bool IsActive);

public record MealScheduleSettingResponse(int Id,
    int EstablishmentId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    int DisplayOrder,
    bool IsActive);
