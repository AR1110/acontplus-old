import {DocElectListResult} from "@billing/domain/models/documento-electronico.model";

export class ElectronicDocListMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 1,
      pageIndex: 1,
      pageSize: 25,
      ...params,
    });
  }

  static fromJson(response: any): DocElectListResult {
    const result = {
      data: [],
      totalRecords: 0,
    };

    if (response.code !== '1') return result;

    const { data = [] } = JSON.parse(response.payload);

    result.data = data.map((item: any, index: number) => ({
      index: index + 1,
      id: item.idDocumentoElectronico,
      codDoc: item.codDoc,
      docName: item.comprobante,
      serieComprobante: item.serieComprobante,
      receiverRuc: item.rucReceptor,
      receiverName: item.razonSocial,
      issueDate: item.fechaEmision,
      accessKey: item.claveAcceso,
      authorizationDate: item.fechaAutorizacion,
      statusName: item.estado,
      statusCode: item.codEstado,
      version: item.versionComp,
      user: item.usuario,
      codEstab: item.codEstab,
    }));

    result.totalRecords = data.length > 0 ? data[0].totalRecords : 0;

    return result;
  }
}
