import { ListScheduleResponse } from '@modules/config/domain/models/schedule.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ScheduleMapper {
  static fromJson(response: ApiResponseLegacy): ListScheduleResponse {
    const result = new ListScheduleResponse();
    if (response.code === '1') {
      const shifts = JSON.parse(response.payload as any);
      result.data = shifts.map((item: any, index: number) => {
        const val = {
          index: index + 1,
          idDia: item.idDia,
          descripcion: item.descripcion,
          estado: item.estado ?? false,
          apertura: item.apertura ?? '',
          cierre: item.cierre ?? '',
        };
        return ScheduleMapper.getDateFromHours(val);
      });
    }

    return result;
  }

  private static getDateFromHours(val: any) {
    const fecha = new Date();
    const horaApertura = val.apertura.split(':');
    const horaCierre = val.cierre.split(':');
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();
    const dia = fecha.getDay();

    val.apertura = new Date(anio, mes, dia, horaApertura[0], horaApertura[1]);
    val.cierre = new Date(anio, mes, dia, horaCierre[0], horaCierre[1]);
    return val;
  }
}
