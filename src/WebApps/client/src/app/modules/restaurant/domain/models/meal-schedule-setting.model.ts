export interface MealScheduleSettingResponse {
  id: number;
  establishmentId: number;
  mealCode: string;
  description: string;
  startTime: string; // TimeSpan as string (HH:mm:ss)
  endTime: string; // TimeSpan as string (HH:mm:ss)
  displayOrder: number;
  isActive: boolean;
}

export interface CreateMealScheduleSettingRequest {
  establishmentId: number;
  mealCode: string;
  description: string;
  startTime: string; // TimeSpan as string (HH:mm:ss)
  endTime: string; // TimeSpan as string (HH:mm:ss)
  displayOrder: number;
  createdByUserId?: number; // Set by backend from user context
}

export interface UpdateMealScheduleSettingRequest {
  id: number;
  establishmentId: number;
  mealCode: string;
  description: string;
  startTime: string; // TimeSpan as string (HH:mm:ss)
  endTime: string; // TimeSpan as string (HH:mm:ss)
  displayOrder: number;
  isActive: boolean;
  updatedByUserId?: number; // Set by backend from user context
}

export interface MealScheduleSettingFormData {
  id?: number;
  establishmentId: number;
  mealCode: string;
  description: string;
  startTime: string;
  endTime: string;
  displayOrder: number;
  isActive: boolean;
}
