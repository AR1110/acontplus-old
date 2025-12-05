using Restaurant.Domain.Enums;

namespace Restaurant.Application.Dtos.MealManagement;

public record MealConsumptionCreate(
    int MealScheduleSettingId,
    int? CompanyCustomerMealPlanId,
    int CompanyCustomerId,
    DateTime ConsumptionDate,
    int Amount,
    ConsumptionStatus ConsumptionStatus,
    int CreatedByUserId);

public record MealConsumptionUpdate(
    int Id,
    int MealScheduleSettingId,
    int CompanyCustomerMealPlanId,
    DateTime ConsumptionDate,
    int Amount,
    ConsumptionStatus ConsumptionStatus,
    string CancellationReason,
    int CancelledByUserId,
    DateTime CancelledAt,
    string CancelledIpAddress);

public record MealConsumptionItem(
    int Id,
    int MealScheduleSettingId,
    string MealScheduleSettingName,
    string CustomerName,
    DateTime ConsumptionDate,
    int Amount,
    ConsumptionStatus Status,
    string CreatedByUser,
    DateTime CreatedAt,
    string? CancellationReason,
    string? CancelledByUser,
    DateTime? CancelledAt);
