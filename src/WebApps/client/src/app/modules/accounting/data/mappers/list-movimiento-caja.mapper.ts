import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListMovimientoCajaResponse } from '@accounting/data/models/movimiento-caja.model';

export class ListMovimientoCajaMapper {
  static toJson(obj: any) {
    return JSON.stringify({ ...obj, tipo: 1 });
  }

  static fromJson(response: ApiResponseLegacy): ListMovimientoCajaResponse {
    const result = new ListMovimientoCajaResponse();
    if (response.code === '1') {
      const { movimientos = [] } = JSON.parse(response.payload as string);

      result.data = movimientos.map((item: any, index: number) => {
        return {
          index: index + 1,
          idMovimientoCaja: item.idMovimientoCaja,
          idTipoDocumento: item.idTipoDocumento,
          codDoc: item.codDoc,
          codEstab: item.codEstab,
          fechaEmision: item.fechaEmision,
          valor: item.valor,
          observaciones: item.observaciones,
          nroDoc: item.nroDoc,
          nomEstado: item.estado,
          nomSubEntidadFinanciera: item.subEntidadFinanciera,
          nomEmpleado: item.empleado,
          idCard: item.nroIdentificacion,
          nomCaja: item.caja,
          totalRecords: item.totalRecords,
          nomUsuario: item.nombreUsuario,
        };
      });

      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }
    return result;
  }
}
