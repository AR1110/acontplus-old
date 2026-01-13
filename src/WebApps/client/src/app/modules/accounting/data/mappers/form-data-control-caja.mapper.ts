import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FormDataControlCajaResponse } from '@accounting/data/models/control-caja.entity';

export class FormDataControlCajaMapper {
  static toJson() {
    return JSON.stringify({ tipo: 2 });
  }

  static fromJson(response: ApiResponseLegacy): FormDataControlCajaResponse {
    const result = new FormDataControlCajaResponse();
    const data = JSON.parse(response.payload as string);

    result.formaPagos = data.formaPagos || [];
    result.tipoDocumento = data.tipoDocumento || [];
    return result;
  }
}
