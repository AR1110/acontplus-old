namespace Restaurant.Application.Dtos.MealManagement;

public record CreateMealPlanRequest(int EstablishmentId,
    string Name,
    string? Description,
    int DailyMealLimit,
    int MontlyMealLimit,
    decimal SubsidyPercentage,
    bool IsDefault,
    int CreatedByUserId);

public record UpdateMealPlanRequest(int Id,
    int EstablishmentId,
    string Name,
    string? Description,
    int DailyMealLimit,
    int MontlyMealLimit,
    decimal SubsidyPercentage,
    bool IsDefault,
    bool IsActive);

public record MealPlanResponse(int Id,
    int EstablishmentId,
    string Name,
    string? Description,
    int DailyMealLimit,
    int MontlyMealLimit,
    decimal SubsidyPercentage,
    bool IsDefault,
    bool IsActive);
