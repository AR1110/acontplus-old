import {ApiResponse} from "acontplus-utils";
import {ListOrderResponse} from "@domain/models/order.model";
import {DOC_TYPE} from "@domain/enums/main.enum";

export class ListOrderMapper {
  static toJson<T>(params: T){
    return JSON.stringify({ tipo: 1, ...params })
  }

  static fromJson(response:ApiResponse): ListOrderResponse{

    const result = new ListOrderResponse();
    if(response.code === '0'){
      return result;
    }
    const {orders=[]} = JSON.parse(response.payload as string);
    result.data = orders.map((item: any) => ({
        id: item.id,
        codDoc: DOC_TYPE.OR,
        codEstab: item.codEstab,
        serie: item.serie,
        discount: item.discount,
        tip: item.tip,
        total: item.total,
        obs: item.obs,
        createdAt: item.createdAt,
        enabled: item.enabled,
        deleted: item.deleted,
        uuid: item.uuid,
        razonSocialComprador: item.nameFiscal,
        identificacionComprador: item.idCard,
        userName: item.userName,
        totalRecords: item.totalRecords,
        divided: item.divided,
        finished: item.finished,
        tableName: item.tableName,
      }),
    )
    result.totalRecords = result.data.length>0? result.data[0].totalRecords : 0;
    return result;

  }
}
