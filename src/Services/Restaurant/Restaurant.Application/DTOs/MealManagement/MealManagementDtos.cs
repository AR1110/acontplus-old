namespace Restaurant.Application.Dtos.MealManagement;

// Employee Meal Plan DTOs
public record CreateEmployeeMealPlanRequest(
    int CompanyCustomerId,
    int MealPlanId,
    DateTime StartDate,
    DateTime? EndDate,
    string? Notes
);

public record UpdateEmployeeMealPlanRequest(
    DateTime? EndDate,
    bool IsActive,
    string? Notes
);

public record EmployeeMealPlanResponse(
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

// Enhanced Meal Plan DTOs
//public record MealPlanResponse(
//    int Id,
//    int EstablishmentId,
//    string Name,
//    string? Description,
//    int DailyMealLimit,
//    int MonthlyMealLimit,
//    decimal SubsidyPercentage,
//    ICollection<MealPlanScheduleResponse> AllowedSchedules,
//    ICollection<EmployeeMealPlanResponse> EmployeeAssignments,
//    DateTime CreatedAt
//);

public record MealPlanScheduleResponse(
    int Id,
    int MealPlanId,
    int MealScheduleSettingId,
    string MealCode,
    string Description,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsIncluded
);

// Enhanced Daily Menu DTOs
public record CreateDailyMenuRequest(
    int EstablishmentId,
    DateTime MenuDate,
    int MealScheduleSettingId,
    int? MealPlanId,
    string Description,
    decimal StandardPrice,
    bool IsAvailable
);

public record UpdateDailyMenuRequest(
    int? MealPlanId,
    string Description,
    decimal StandardPrice,
    bool IsAvailable
);

public record DailyMenuResponse(
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

// Enhanced Meal Consumption DTOs
//public record CreateMealConsumptionRequest(
//    int MonthlyAllowanceId,
//    int MealScheduleSettingId,
//    int? OrderId,
//    decimal Amount,
//    decimal SubsidyAmount,
//    decimal EmployeePayment
//);

public record MealConsumptionResponse(
    int Id,
    int MonthlyAllowanceId,
    int CompanyCustomerId, // Derived from MonthlyAllowance.EmployeeMealPlan.CompanyCustomerId
    string? EmployeeName, // Derived from relationship
    int MealScheduleSettingId,
    string MealScheduleName,
    string MealPlanName, // Derived from MonthlyAllowance.EmployeeMealPlan.MealPlan.Name
    int? OrderId,
    DateTime ConsumptionDate,
    decimal Amount,
    decimal SubsidyAmount,
    decimal EmployeePayment,
    string Status,
    string CancellationReason,
    DateTime CreatedAt
);

// Summary DTOs
public record EmployeeMealSummaryResponse(
    int CompanyCustomerId,
    string? EmployeeName,
    EmployeeMealPlanResponse? CurrentMealPlan,
    MonthlyMealAllowanceResponse? CurrentMonthAllowance,
    ICollection<MealConsumptionResponse> RecentConsumptions
);

public record MonthlyMealAllowanceResponse(
    int Id,
    int EmployeeMealPlanId,
    string MealPlanName,
    int CompanyCustomerId, // Derived from EmployeeMealPlan
    string? EmployeeName, // Derived from EmployeeMealPlan
    int Year,
    int Month,
    int AllocatedMeals,
    int ConsumedMeals,
    int RemainingMeals,
    decimal TotalSubsidy,
    decimal EmployeeContribution,
    DateTime CreatedAt
);

// New DTOs for allowance management
public record GenerateMonthlyAllowanceRequest(
    int EmployeeMealPlanId,
    int Year,
    int Month
);

public record UpdateAllowanceConsumptionRequest(
    int ConsumedMeals,
    string? Notes
);
