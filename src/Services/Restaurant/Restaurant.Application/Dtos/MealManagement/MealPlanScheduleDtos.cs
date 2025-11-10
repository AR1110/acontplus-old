namespace Restaurant.Application.Dtos.MealManagement;

public record MealPlanScheduleItem(
    int Id,
    int MealPlanId,
    int MealScheduleSettingId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsIncluded
);
