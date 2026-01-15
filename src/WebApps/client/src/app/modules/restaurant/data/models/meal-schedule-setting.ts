export interface MealScheduleSetting {
  id: number;
  establishmentId: number;
  mealCode: string;
  description: string;
  startTime: string; // TimeSpan as string (HH:mm:ss)
  endTime: string; // TimeSpan as string (HH:mm:ss)
  displayOrder: number;
  isActive: boolean;
  onTime: boolean;
}

export interface MealScheduleSettingCreate {
  establishmentId: number;
  mealCode: string;
  description: string;
  startTime: string; // TimeSpan as string (HH:mm:ss)
  endTime: string; // TimeSpan as string (HH:mm:ss)
  displayOrder: number;
  createdByUserId?: number; // Set by backend from user context
}

export interface MealScheduleSettingUpdate {
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
