import { SolicitudAutorizacionResponse } from '@modules/config/data/models/solicitud-autorizacion.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ListSolicitudAutorizacionMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: ApiResponseLegacy): SolicitudAutorizacionResponse {
    const { requests = [] } = JSON.parse(response.payload as any);

    const data = requests.map((item: any, index: number) => {
      return {
        index: index + 1,
        rowguid: item.rowguid,
        idSolicitudAutorizacion: item.idSolicitudAutorizacion,
        usuarioAprobante: item.usuarioAprobante,
        usuarioSolicitante: item.usuarioSolicitante,
        codigoAccion: item.codigoAccion,
        codigoEstado: item.codigoEstado,
        nombreAccion: item.nombreAccion,
        nombreEstado: item.nombreEstado,
        obs: item.obs,
        fechaRegistro: item.fechaRegistro,
        fechaRespuesta: item.fechaRespuesta,
        codigoModulo: item.codigoModulo,
        nombreModulo: item.nombreModulo,
        serieComprobante: item.serieComprobante,
        totalRecords: item.serieComprobante,
        nomAdminRoles: item.nomAdminRoles,
      };
    });
    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;
    return {
      data,
      totalRecords,
    };
  }
}
