import { ComprobanteEgresoFilterResponse } from '@accounting/data/models/comprobante-egreso.entity';
import { groupEstabUtil } from '@core/utils/group-estab.util';

export class DataFilterComprobanteEgresoMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2,
    });
  }

  static fromJson(response: any): ComprobanteEgresoFilterResponse {
    const estabs = groupEstabUtil({
      estabs: response.estabs || [],
      isGroupPuntoEmision: true,
    });
    return {
      estabs,
      users: response.users || [],
      bancos: response.banco || [],
      tiposDoc: response.tipoDocumento || [],
      subEntidadesFinanciera: response.subEntidadFinanciera || [],
    };
  }
}
