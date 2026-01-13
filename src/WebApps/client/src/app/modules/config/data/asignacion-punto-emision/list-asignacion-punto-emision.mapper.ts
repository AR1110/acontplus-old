import {
  AsignacionPuntoEmisionList,
  AsignacionPuntoEmisionResponse,
} from '@modules/config/data/models/user-customer/asignacion-punto-emision.model';

export class ListAsignacionPuntoEmisionMapper {
  static toJson(parameters: Partial<AsignacionPuntoEmisionList>) {
    return JSON.stringify({
      tipo: 1,
      codEstab_Asig: parameters.codEstab_Asig,
    });
  }

  static fromJson(response: any): AsignacionPuntoEmisionResponse {
    const puntosEmisionAsignadas = response?.puntosEmisionAsignadas || [];
    const data = puntosEmisionAsignadas.map((item: any, index: any) => {
      return {
        index: index + 1,
        idPtoEmi_Asig: item.idPtoEmi_Asig,
        codEstab_Asig: item.codEstab_Asig,
        idPuntoEmision: item.idPuntoEmision,
        ptoEmi: item.ptoEmi,
        defaultPtoEmi: item.predeterminado,
        estado: item.estado,
        nomEstado: item.estado ? 'Asignado' : 'No Asignado',
      };
    });

    return {
      data,
    };
  }
}
