export enum ConsumptionStatus {
  Completed = 1,
  Cancelled = 2,
  Pending = 3,
}

export interface MealConsumption {
  id: number;
  mealScheduleSettingId: number;
  mealScheduleSettingName: string;
  companyCustomerMealPlanId: number;
  companyCustomerName: string;
  consumptionDate: Date;
  amount: number;
  consumptionStatus: ConsumptionStatus;
  createdByUserId: number;
  createdAt: Date;
  createdIpAddress: string;
  cancellationReason?: string | null;
  cancelledByUserId?: number | null;
  cancelledAt?: Date | null;
  cancelledIpAddress?: string | null;
}

export interface CreateMealConsumptionRequest {
  mealScheduleSettingId: number;
  companyCustomerMealPlanId: number;
  consumptionDate: Date;
  amount: number;
  consumptionStatus: ConsumptionStatus;
  createdByUserId?: number; // Set by backend from user context
}

export interface UpdateMealConsumptionRequest {
  id: number;
  mealScheduleSettingId: number;
  companyCustomerMealPlanId: number;
  consumptionDate: Date;
  amount: number;
  consumptionStatus: ConsumptionStatus;
  cancellationReason?: string;
  cancelledByUserId?: number;
  cancelledAt?: Date;
  cancelledIpAddress?: string;
}

export interface CancelMealConsumptionRequest {
  id: number;
  cancellationReason: string;
}
