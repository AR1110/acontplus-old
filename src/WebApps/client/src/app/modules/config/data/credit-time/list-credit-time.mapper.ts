import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListCreditTimeResponse } from '@modules/config/data/models/tiempo-credito.model';

export class ListCreditTimeMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 1,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    });
  }

  static fromJson(response: ApiResponseLegacy): ListCreditTimeResponse {
    const result = new ListCreditTimeResponse();
    if (response.code === '1') {
      const creditTimes = JSON.parse(response.payload as any);
      result.data = creditTimes.map((item: any, index: number) => {
        return {
          index: index + 1,
          idTiempoCredito: item.idTiempoCredito,
          gestion: item.gestion,
          diasCredito: item.diasCredito,
          numeroCuota: item.numeroCuota,
          descripcion: item.descripcion,
          entrada: item.entrada,
          estado: item.estado,
          tipo: item.tipo,
          nombreGestion: item.nombreGestion,
          nombreEntrada: item.entrada ? 'SI' : 'NO',
          tipoCredito: item.tipoCredito,
          totalRecords: item.totalRecords,
          nombreEstado: item.estado ? 'ACTIVO' : 'INACTIVO',
        };
      });

      result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    }

    return result;
  }
}
