using Restaurant.Domain.Enums;

namespace Restaurant.Application.DTOs.MealManagement;

public record MealConsumptionCreate(int MealScheduleSettingId,
    int CompanyCustomerMealPlanId,
    DateTime ConsumptionDate,
    int Amount,
    ConsumptionStatus ConsumptionStatus,
    int CreatedByUserId);

public record MealConsumptionUpdate(int Id,
    int MealScheduleSettingId,
    int CompanyCustomerMealPlanId,
    DateTime ConsumptionDate,
    int Amount,
    ConsumptionStatus ConsumptionStatus,
    string CancellationReason,
    int CancelledByUserId,
    DateTime CancelledAt,
    string CancelledIpAddress);

public record MealConsumptionItem(int Id,
    int MealScheduleSettingId,
    string MealScheduleSettingName,
    int CompanyCustomerMealPlanId,
    string CompanyCustomerName,
    DateTime ConsumptionDate,
    int Amount,
    ConsumptionStatus ConsumptionStatus,
    int CreatedByUserId,
    DateTime CreatedAt,
    string CreatedIpAddress,
    string? CancellationReason,
    int? CancelledByUserId,
    DateTime? CancelledAt,
    string? CancelledIpAddress);
