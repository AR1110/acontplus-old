namespace Restaurant.Application.Dtos.MealManagement;

public record MealPlanCreate(
    int EstablishmentId,
    string Name,
    string? Description,
    int DailyMealLimit,
    int MontlyMealLimit,
    decimal SubsidyPercentage,
    bool IsDefault,
    int CreatedByUserId);

public record MealPlanUpdate(
    int Id,
    int EstablishmentId,
    string Name,
    string? Description,
    int DailyMealLimit,
    int MontlyMealLimit,
    decimal SubsidyPercentage,
    bool IsDefault,
    bool IsActive);

public record MealPlanItem(
    int Id,
    int EstablishmentId,
    string Name,
    string? Description,
    int DailyMealLimit,
    int MontlyMealLimit,
    decimal SubsidyPercentage,
    bool IsDefault,
    bool IsActive);
