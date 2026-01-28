import { SolicitudAutorizacionFilterResponse } from '@modules/config/data/models/solicitud-autorizacion.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class FilterSolicitudAutorizacionMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 3,
    });
  }
  static fromJson(response: ApiResponseLegacy): SolicitudAutorizacionFilterResponse {
    const payload = JSON.parse(response.payload as any);

    const estabs = groupEstabUtil({
      estabs: payload.estabs,
      isGroupPuntoEmision: true,
    });

    return {
      estabs: estabs,
      usersRole: payload.usersRole,
    };
  }
}
