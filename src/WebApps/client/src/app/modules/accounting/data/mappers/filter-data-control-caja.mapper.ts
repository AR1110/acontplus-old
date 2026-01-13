import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FilterDataControlCajaResponse } from '@accounting/data/models/control-caja.entity';

export class FilterDataControlCajaMapper {
  static toJson() {
    return JSON.stringify({ tipo: 5 });
  }

  static fromJson(response: ApiResponseLegacy): FilterDataControlCajaResponse {
    const result = new FilterDataControlCajaResponse();
    const data = JSON.parse(response.payload as string);
    result.estados = data.estadoPago || [];
    return result;
  }
}
