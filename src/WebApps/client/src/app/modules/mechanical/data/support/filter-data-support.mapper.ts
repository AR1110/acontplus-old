import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FilterDataSupportResponse } from '@mechanical/domain/models/support.model';

export class FilterDataSupportMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 8,
    });
  }

  static fromJson(response: ApiResponseLegacy): FilterDataSupportResponse {
    const data = new FilterDataSupportResponse();
    if (response.code === '1') {
      const { supportStatus = [] } = JSON.parse(response.payload as string);
      data.supportStatus = supportStatus;
    }
    return data;
  }
}
