import { AsignacionEstabResponse } from '@modules/config/data/models/user-customer/asignacion-estab.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ListAsignacionEstabMapper {
  static toJson(parameters: any) {
    return JSON.stringify({
      tipo: 1,
      idUsuarioRol: parameters.userRoleId,
    });
  }

  static fromJson(response: ApiResponseLegacy): AsignacionEstabResponse {
    const estabs = JSON.parse(response.payload as string) || [];
    const data = estabs.map((item: any, index: any) => {
      return {
        index: index + 1,
        idEstab_Asig: item.idEstab_Asig,
        codEstab_Asig: item.codEstab_Asig,
        codEstab: item.codEstab,
        estab: item.estab,
        nombreComercial: item.nombreComercial,
        defaultEstab: item.predeterminado,
        estado: item.estado,
        idEstablecimiento: item.idEstablecimiento,
      };
    });

    return {
      data,
    };
  }
}
