import {ComprobanteEgresoResponse} from "@accounting/core/models/comprobante-egreso.model";

export class ListComprobanteEgresoMapper {
  static toJson(response:any){
    return JSON.stringify({
      pageIndex: 1,
      pageSize: response.pageSize || 10,
    });
  }

  static fromJson(response:any): ComprobanteEgresoResponse{
    console.log(response)
    return {
      data: [],
      totalRecords: 0
    }
  }
}
