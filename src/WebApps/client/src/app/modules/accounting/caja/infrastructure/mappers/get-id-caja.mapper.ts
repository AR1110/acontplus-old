import { ApiResponse } from '@core/models/api-response';
import { GetIdCajaResponse } from '@accounting/caja/domain/caja.entity';

export class GetIdCajaMapper {
  static toJson(id: number) {
    return JSON.stringify({ id, tipo: 3 });
  }

  static fromJson(response: ApiResponse): GetIdCajaResponse {
    const result = new GetIdCajaResponse();
    if (response.code === '1') {
      const { caja = [], asignaciones = [] } = JSON.parse(response.payload as string);

      result.caja = caja[0] || {};
      result.asignaciones = asignaciones;
    }
    return result;
  }
}
