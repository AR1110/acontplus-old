import { ProformaInvoiceListResult } from '@sale/domain/models/proforma-invoice';
import { ApiResponse } from '@core/models/api-response';

export class ProformaInvoiceListMapper {
  static toJson(obj: any) {
    return JSON.stringify({
      tipo: 1,
      ...obj,
    });
  }

  static fromJson(response: ApiResponse) {
    const result = new ProformaInvoiceListResult();
    if (response.code !== '1') return result;

    const { proformaInvoices } = JSON.parse(response.payload as string);

    result.data = proformaInvoices.map((item: any, index: number) => {
      return {
        index: index + 1,
        id: item.idProforma,
        issuedDate: item.fechaEmision,
        customerName: item.nombreFiscal,
        nroDoc: item.nroDocumento,
        customerCardId: item.nroIdentificacion,
        statusName: item.estadoDoc,
        user: item.usuario,
        codDoc: item.codDoc,
        total: item.total,
        rowColor: item.rowColor,
        statusCode: item.codEstado,
        // "entidad": "ZABALA ARELLANO CARLOS HERNAN",
        // "codEstab": "ESTAB-000000059",
        //
        // "idTipoDocumento": 13,
        // "idCliente": 234482,
        // "nombreComercial": "HOTEL RIO NAPO",
        // "telefonoEstablecimiento": "062880872 0980023719",
        // "correo": "contabilidad@cocaltda.fin.ec",
        // "telefono": "063700260",
        // "totalRecords": 25,
        // "totalDocument": 15739.62
      };
    });
    result.totalRecords = proformaInvoices.length > 0 ? proformaInvoices[0].totalRecords : 0;

    return result;
  }
}
