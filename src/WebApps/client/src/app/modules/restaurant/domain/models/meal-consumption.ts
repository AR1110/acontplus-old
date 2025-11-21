export enum ConsumptionStatus {
  Completed = 'completed',
  Cancelled = 'cancelled',
  Pending = 'pending',
}

export interface MealConsumption {
  id: number;
  mealScheduleSettingId: number;
  mealScheduleSettingName: string;
  companyCustomerMealPlanId: number;
  customerName: string;
  consumptionDate: Date;
  amount: number;
  status: ConsumptionStatus;
  createdByUserId: number;
  createdAt: Date;
  createdIpAddress: string;
  cancellationReason?: string | null;
  cancelledByUserId?: number | null;
  cancelledAt?: Date | null;
  cancelledIpAddress?: string | null;
  empresa?: string;
  customer?: string;
  mealSchedule?: string;
}

export interface CustomerSearchResult {
  idCliente: number;
  numeroIdentificacion: string;
  razonSocial: string;
  empresa: string;
  cargo: string;
  idEmpresa: number;
}

export interface MealScheduleForCustomer {
  id: number;
  mealScheduleSettingId: number;
  mealCode: string;
  description: string;
  startDate: string; // Time as string HH:mm:ss
  endDate: string;
  isActive: boolean; // Already registered for this client
  onTime: boolean; // Currently available based on time
  amount?: number;
}

export interface PrintConsumptionResponse {
  code: string;
  message: string;
  payload: string; // JSON string with print data
}

export interface CancellationDetails {
  id: number;
  cancellationReason: string;
  cancelledByUser?: string;
  cancelledAt?: Date;
}

export interface MealConsumptionCreate {
  mealScheduleSettingId: number;
  companyCustomerMealPlanId: number;
  consumptionDate: Date;
  amount: number;
  consumptionStatus: ConsumptionStatus;
  createdByUserId?: number; // Set by backend from user context
  onTime?: boolean; // Indicates if it's for current time or other date
  idCliente?: number; // For backward compatibility
}

export interface MealConsumptionCreateForOtherDateRequest {
  mealScheduleSettingId: number;
  idCliente: number;
  consumptionDate: Date | string; // Support string for timezone formatting
  amount: number;
}

export interface MealConsumptionUpdate {
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

export interface MealConsumptionCancel {
  id: number;
  cancellationReason: string;
}
