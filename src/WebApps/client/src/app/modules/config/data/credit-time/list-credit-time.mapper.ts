import {ApiResponse} from "@core/models/api-response";
import {ListCreditTimeResponse} from "@modules/config/domain/models/tiempo-credito.model";


export class ListCreditTimeMapper {
  static toJson(params: any){

  }

  static fromJson(response:ApiResponse): ListCreditTimeResponse{
    const result = new ListCreditTimeResponse();
    if(response.code==="1"){
      const [creditTimes]= JSON.parse(response.payload as any);
      result.data = creditTimes.map((item:any, index: number)=>{
        return {}
      })
    }

    return result;

  }
}
