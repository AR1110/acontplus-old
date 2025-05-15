import {ApiResponse} from "@core/models/api-response";
import {ElectronicSignatureListResponse} from "@modules/config/domain/models/electronic-signature.model";

export class ListElectronicSignatureMapper {

  static fromJson(response:ApiResponse): ElectronicSignatureListResponse{
    let result = new ElectronicSignatureListResponse();
    if(response.code==="1"){
      const [signatures]= JSON.parse(response.payload as any);
      result.data = signatures
    }

    return result;
  }
}
