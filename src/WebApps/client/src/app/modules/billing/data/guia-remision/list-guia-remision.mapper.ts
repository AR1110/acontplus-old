import { GuiasRemisionResponse } from '@billing/domain/models/guia-remision/guia-remision.model';

export class ListGuiaRemisionMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: any): GuiasRemisionResponse {
    const guias = response.guias || [];

    const data = guias.map((item: any, index: number) => {
      return {
        index: index + 1,
        idGuiaRemision: item.idGuiaRemision,
        codEstab: item.codEstab,
        fechaEmision: item.fechaEmision,
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
        claveAcceso: item.claveAcceso,
        serieComprobante: item.serieComprobante,
        razonSocialDestinatario: item.razonSocialDestinatario,
        identificacionDestinatario: item.identificacionDestinatario,
        serieComprobanteInvoice: item.serieFactura,
        razonSocialTransportista: item.razonSocialTransportista,
        nomEstado: item.estado,
        nomUsuario: item.usuario,
        statusStyle: item.style,
        totalRecords: item.totalRecords,
      };
    });

    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;

    return {
      data,
      totalRecords,
    };
  }
}
