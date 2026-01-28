import { ComprobanteEgresoDeleteResponse } from '@accounting/data/models/comprobante-egreso.entity';

export class GetComprobanteEgresoForDeletionMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 5,
      id: params.id,
    });
  }

  static fromJson(response: any): ComprobanteEgresoDeleteResponse {
    const cuentas = response.cuentas || [];
    const cuotas = response.cuotas || [];
    const estadosPago = response.estadoPago || [];

    return {
      cuentas,
      cuotas,
      estadosPago,
    };
  }
}
