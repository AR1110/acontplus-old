import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ListAnticipoMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 1,
      ...params,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    let data = [];
    if (response.code === '1') {
      const { anticipos = [] } = JSON.parse(response.payload as string);
      data = anticipos.map((item: any, index: number) => {
        return {
          index: index + 1,
          idAnticipo: item.idAnticipo,
          idTipoDocumento: item.idTipoDocumento,
          codEstab: item.codEstab,
          fechaEmision: item.fechaEmision,
          valor: item.valor,
          obs: item.obs,
          serieComprobante: item.serieComprobante,
          identificacion: item.identificacion,
          razonSocialCiente: item.nombreFiscal,
          subEntidadFinanciera: item.subEntidadFinanciera,
          estadoDoc: item.estadoDoc,
          codDoc: item.codDoc,
          identificacionUsuario: item.identificacionUsuario,
          totalRecords: item.totalRecords,
          nomUsuario: item.usuario,
        };
      });
    }

    return data;
  }
}
