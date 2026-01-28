import {
  SolicitudAutorizacionDetalleList,
  SolicitudAutorizacionList,
} from '@modules/config/data/models/solicitud-autorizacion.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ListSolicitudAutorizacionDetalleMapper {
  static toJson<T>(parameters: Partial<SolicitudAutorizacionList>) {
    return JSON.stringify({
      tipo: 4,
      id: parameters.idSolicitudAutorizacion,
    });
  }

  static fromJson(response: ApiResponseLegacy): SolicitudAutorizacionDetalleList[] {
    const { list = [] } = JSON.parse(response.payload as any);

    const data = list.map((item: any, index: number) => {
      return {
        index: index + 1,
        nombre: item.nombre,
        valor: item.valor,
        nuevoValor: item.nuevoValor,
        obs: item.obs,
      };
    });
    return data;
  }
}
