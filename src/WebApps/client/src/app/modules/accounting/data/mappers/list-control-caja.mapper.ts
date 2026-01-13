import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListControlCajaResponse } from '@accounting/data/models/control-caja.entity';

export class ListControlCajaMapper {
  static toJson(obj: any) {
    return JSON.stringify({ ...obj, tipo: 1 });
  }
  static fromJson(response: ApiResponseLegacy): ListControlCajaResponse {
    const result = new ListControlCajaResponse();
    if (response.code === '1') {
      const movimientos = JSON.parse(response.payload as string).movimientos || [];
      result.data = movimientos.map((item: any, index: number) => {
        return {
          id: item.id,
          fechaApertura: item.fechaApertura,
          fechaCierre: item.fechaCierre,
          faltante: item.faltante,
          sobrante: item.sobrante,
          totalArqueo: item.totalArqueo,
          estado: item.estado,
          statusName: item.estado ? 'ABIERTO' : 'CERRADO',
          receptor: item.receptor,
          totalRecords: item.totalRecords,
        };
      });
      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }
    return result;
  }
}
