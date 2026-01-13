import {ApiResponseLegacy} from "@core/models/api-response-legacy";
import {FormDataCajaResponse, GetIdCajaResponse, ListCajaResponse} from "@accounting/data/models/caja";

export class ListCajaMapper {
  static toJson(params: any) {
    return JSON.stringify({ ...params, tipo: 1 });
  }
  static fromJson(response: ApiResponseLegacy) {
    const result = new ListCajaResponse();
    if (response.code === '1') {
      const cajas = JSON.parse(response.payload as string).cajas;
      result.data = cajas.map((item: any) => {
        return {
          idCaja: item.idCaja,
          descripcion: item.descripcion,
          estado: item.estado,
          actividad: item.actividad,
          usuario: item.usuario,
          turno: item.turno,
          idTurno: item.idTurno,
          idUsuario: item.idUsuario,
          nomEstado: item.estado ? 'Activo' : '',
          totalRecords: item.totalRecords,
        };
      });
      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }
    return result;
  }
}


export class GetIdCajaMapper {
  static toJson(id: number) {
    return JSON.stringify({ id, tipo: 3 });
  }

  static fromJson(response: ApiResponseLegacy): GetIdCajaResponse {
    const result = new GetIdCajaResponse();
    if (response.code === '1') {
      const { caja = [], asignaciones = [] } = JSON.parse(response.payload as string);

      result.caja = caja[0] || {};
      result.asignaciones = asignaciones;
    }
    return result;
  }
}


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
