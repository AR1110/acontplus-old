import { ComprobanteEgresoResponse } from '@accounting/data/models/comprobante-egreso.entity';

export class ListComprobanteEgresoMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 1,
      ...params,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize || 10,
    });
  }

  static fromJson(response: any): ComprobanteEgresoResponse {
    const results = response.comprobantesEgreso || [];
    const data = results.map((item: any, index: number) => {
      return {
        index: index + 1,
        idComprobanteEgreso: item.idComprobanteEgreso,
        total: item.total,
        codEstab: item.codEstab,
        fechaRegistro: item.fechaRegistro,
        nroDoc: item.nroDoc,
        nomPersona: item.nomPersona,
        nroIdentificacion: item.nroIdentificacion,
        nomCaja: item.nomCaja,
        color: item.color,
        nomEstado: item.nomEstado,
        nomUsuario: item.nomUsuario,
        totalRecords: item.totalRecords,
        estado: item.estado,
      };
    });
    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;
    return {
      data,
      totalRecords,
    };
  }
}
