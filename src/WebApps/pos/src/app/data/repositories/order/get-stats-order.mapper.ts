import {ApiResponse} from "acontplus-utils";
import {  GetStatsOrderResponse,
} from "@domain/models/order.model";

export class GetStatsOrderMapper {
  static toJson(obj:any){
    return JSON.stringify({ ...obj, tipo: 5 })
  }

  static fromJson(response:ApiResponse): GetStatsOrderResponse{
    const result = new GetStatsOrderResponse()

    if (response.code === '1' && response.payload) {
      const mainData = JSON.parse(response.payload as string);
      // Desestructuración para mejorar la legibilidad
      const {
        order = [],
        docs = [],
        productsTop = [],
        documentCounts = [],
      } = mainData;

      // Asignación de datos
      result.sales = [...order, ...docs];
      result.productsTop = productsTop;

      result.documentCounts = documentCounts;
    }

    return result;
  }


}
