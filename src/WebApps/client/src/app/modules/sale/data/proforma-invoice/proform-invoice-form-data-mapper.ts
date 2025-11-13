import {ApiResponseLegacy} from "@core/models/api-response-legacy";

export class ProformaInvoiceFormDataMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2
    })
  }

  static fromJson(response: ApiResponseLegacy) {
    console.log(response);
    return {}
  }
}
