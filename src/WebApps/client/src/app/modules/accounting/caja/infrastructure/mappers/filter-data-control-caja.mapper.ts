import { ApiResponse } from '@core/models/api-response';
import { FilterDataControlCajaResponse } from '@accounting/caja/domain/control-caja.entity';

export class FilterDataControlCajaMapper {
  static toJson() {
    return JSON.stringify({ tipo: 5 });
  }

  static fromJson(response: ApiResponse): FilterDataControlCajaResponse {
    const result = new FilterDataControlCajaResponse();
    const data = JSON.parse(response.payload as string);
    result.estados = data.estadoPago || [];
    return result;
  }
}
