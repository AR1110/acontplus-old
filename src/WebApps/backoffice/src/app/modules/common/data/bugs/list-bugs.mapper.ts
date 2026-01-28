import { ApiResponse } from 'acontplus-utils';
import {BugsResponse} from "@modules/common/domain/models/bugs.model";

export class ListBugsMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: ApiResponse): BugsResponse {
    const {bugs=[]} = JSON.parse(response.payload as any)


    const data = bugs.map((item:any, index: number)=>{
      return {
        ...item,
        index: index +1
      }
    })
    const totalRecords = bugs.length>0? bugs[0].totalRecords: 0
    return {
      data ,
      totalRecords,
    };
  }
}
