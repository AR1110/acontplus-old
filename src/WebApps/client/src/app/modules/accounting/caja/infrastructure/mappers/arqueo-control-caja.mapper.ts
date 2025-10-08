import { ApiResponse } from '@core/models/api-response';
import { ArqueoControlCajaResponse } from '@accounting/caja/domain/control-caja.entity';

export class ArqueoControlCajaMapper {
  static toJson(id: number) {
    return JSON.stringify({ id, tipo: 8 });
  }

  static fromJson(response: ApiResponse): ArqueoControlCajaResponse {
    const result = new ArqueoControlCajaResponse();
    if (response.code === '1') {
      const data = JSON.parse(response.payload as string);
      result.data = data.arqueoCajaDetalle || [];
    }
    return result;
  }
}
