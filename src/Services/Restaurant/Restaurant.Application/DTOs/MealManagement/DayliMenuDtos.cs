namespace Restaurant.Application.Dtos.MealManagement;

public record DailyMenuCreate(
    int EstablishmentId,
    DateTime MenuDate,
    int MealScheduleSettingId,
    int? MealPlanId,
    string Description,
    decimal StandardPrice,
    bool IsAvailable
);

public record DailyMenuUpdate(
    int? MealPlanId,
    string Description,
    decimal StandardPrice,
    bool IsAvailable
);

public record DailyMenuItem(
    int Id,
    int EstablishmentId,
    DateTime MenuDate,
    int MealScheduleSettingId,
    string MealScheduleName,
    int? MealPlanId,
    string? MealPlanName,
    string Description,
    decimal StandardPrice,
    bool IsAvailable,
    DateTime CreatedAt
);
