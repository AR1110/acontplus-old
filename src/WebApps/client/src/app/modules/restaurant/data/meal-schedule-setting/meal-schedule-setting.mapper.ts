import { ApiResponse } from '@core/models/api-response';
import { MealScheduleSettingResponse } from '@restaurant/domain/models/meal-schedule-setting.model';

export class MealScheduleSettingMapper {
  static fromApiResponse(
    response: ApiResponse<MealScheduleSettingResponse[]>
  ): MealScheduleSettingResponse[] {
    if (!response.payload) {
      return [];
    }
    return response.payload;
  }

  static fromApiSingleResponse(
    response: ApiResponse<MealScheduleSettingResponse>
  ): MealScheduleSettingResponse | null {
    return response.payload ?? null;
  }
}
