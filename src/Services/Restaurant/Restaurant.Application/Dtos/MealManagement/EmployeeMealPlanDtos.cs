namespace Restaurant.Application.Dtos.MealManagement;

public record EmployeeMealPlanCreate(
    int CompanyCustomerId,
    int MealPlanId,
    DateTime StartDate,
    DateTime? EndDate,
    string? Notes
);

public record EmployeeMealPlanUpdate(
    DateTime? EndDate,
    bool IsActive,
    string? Notes
);

public record EmployeeMealPlanItem(
    int Id,
    int CompanyCustomerId,
    int MealPlanId,
    string MealPlanName,
    DateTime StartDate,
    DateTime? EndDate,
    bool IsActive,
    string? Notes,
    DateTime CreatedAt
);

public record EmployeeMealSummary(
    int CompanyCustomerId,
    string? EmployeeName,
    EmployeeMealPlanItem? CurrentMealPlan,
    ICollection<MealConsumptionItem> RecentConsumptions
);
