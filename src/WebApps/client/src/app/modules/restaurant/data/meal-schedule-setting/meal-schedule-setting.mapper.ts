import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MealScheduleSetting } from '@restaurant/domain/models/meal-schedule-setting';

export class MealScheduleSettingMapper {
  static fromApiResponse(
    response: ApiResponseLegacy<MealScheduleSetting[]>,
  ): MealScheduleSetting[] {
    if (!response.payload) {
      return [];
    }
    return response.payload;
  }

  static fromApiSingleResponse(
    response: ApiResponseLegacy<MealScheduleSetting>,
  ): MealScheduleSetting | null {
    return response.payload ?? null;
  }
}
