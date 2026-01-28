import {ApiResponse} from "acontplus-utils";
import {ActionResponse} from "@modules/seguridad/domain/models/action.model";

export class ListActionMapper {

  static toJson<T>(parameters:T){
    return JSON.stringify({
      tipo: 1,
      ...parameters
    })
  }

  static fromJson(response: ApiResponse): ActionResponse {
    console.log(response)
    const actions = (response.payload as any[]) || [];
    const data = actions.map((item:any, index: number)=>{
      return {
        index: index+1,
        code: item.code,
         name: item.name,
        description: item.description,
        id: item.id,
        isActive: item.isActive,
        deleted: item.deleted,
      }
    })
    return {
      data ,
      totalRecords: 0,
    };
  }
}
