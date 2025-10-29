import {ApiResponse} from "@core/models/api-response";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {GroupedEstab} from "@core/models/estab.model";

export class ProformaInvoiceFilterMapper {
  static toJson(){
    return JSON.stringify({
      tipo: 3
    })
  }

  static fromJson(response:ApiResponse){
    const result =  {
      estabs: [] as GroupedEstab[]
    }
    const {estabs} = JSON.parse(response.payload as string);
    result.estabs = groupEstabUtil({
      estabs,
      isGroupPuntoEmision: true,
    })

    return result;
  }
}
