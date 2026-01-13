import {
  AsignacionBodegaList,
  AsignacionBodegaResponse,
} from '@modules/config/data/models/user-customer/asignacion-bodega.model';

export class ListAsignacionBodegaMapper {
  static toJson(parameters: Partial<AsignacionBodegaList>) {
    return JSON.stringify({
      tipo: 1,
      codEstab_Asig: parameters.codEstab_Asig,
    });
  }

  static fromJson(response: any): AsignacionBodegaResponse {
    const bodegasAsignadas = response?.bodegasAsignadas || [];
    const data = bodegasAsignadas.map((item: any, index: any) => {
      return {
        index: index + 1,
        idBodeg_Asig: item.idBodeg_Asig,
        codEstab_Asig: item.codEstab_Asig,
        idBodega: item.idBodega,
        descripcion: item.bodega,
        defaultBodga: item.predeterminado,
        estado: item.estado,
        nomEstado: item.estado ? 'Asignado' : 'No Asignado',
      };
    });

    return {
      data,
    };
  }
}
