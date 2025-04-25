import {ApiResponse} from "acontplus-utils";
import {CheckStockProps} from "@domain/models/inventory/product.model";

export class CheckStockMapper {
  static toJson(params:CheckStockProps){
    return JSON.stringify({
      tipo: 7,
      ...params,
    });
  }

  static fromJson(response:ApiResponse): ApiResponse{
    if (response.code === '0') {
      throw response;
    }
    const { stockCheckResponse } = JSON.parse(response.payload as string);
    return stockCheckResponse[0];
  }
}
