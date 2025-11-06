import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FormDataCajaResponse } from '@accounting/caja/domain/caja.entity';

export class FormDataCajaMapper {
  static toJson() {
    return JSON.stringify({ tipo: 2 });
  }

  static fromJson(response: ApiResponseLegacy): FormDataCajaResponse {
    const result = new FormDataCajaResponse();
    const data = JSON.parse(response.payload as string);
    result.usuarios = data.usuarios || [];
    result.turnos = data.turnos || [];
    return result;
  }
}
