import { ListShiftResponse } from '@modules/config/data/models/shift.models';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ListShiftMapper {
  static toJson(params: any) {
    return JSON.stringify({
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    });
  }

  static fromJson(response: ApiResponseLegacy): ListShiftResponse {
    const result = new ListShiftResponse();
    if (response.code === '1') {
      const shifts = JSON.parse(response.payload as any);
      result.data = shifts.map((item: any, index: number) => {
        return {
          index: index + 1,
          idTurno: item.idTurno,
          descripcion: item.descripcion,
          estado: item.estado ?? false,
          idUsuario: item.idUsuario ?? 0,
          idEntidad: item.idEntidad ?? 0,
          totalRecords: item.totalRecords ?? 0,
        };
      });

      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }

    return result;
  }
}
