import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MealScheduleSettingResponse } from '@restaurant/domain/models/meal-schedule-setting.model';

export class MealScheduleSettingMapper {
  static fromApiResponse(
    response: ApiResponseLegacy<MealScheduleSettingResponse[]>,
  ): MealScheduleSettingResponse[] {
    if (!response.payload) {
      return [];
    }
    return response.payload;
  }

  static fromApiSingleResponse(
    response: ApiResponseLegacy<MealScheduleSettingResponse>,
  ): MealScheduleSettingResponse | null {
    return response.payload ?? null;
  }
}
