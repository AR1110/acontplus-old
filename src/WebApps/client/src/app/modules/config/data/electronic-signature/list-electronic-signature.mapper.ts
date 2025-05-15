import {ApiResponse} from "@core/models/api-response";
import {ElectronicSignatureListResponse} from "@modules/config/domain/models/electronic-signature.model";

export class ListElectronicSignatureMapper {

  static fromJson(response:ApiResponse): ElectronicSignatureListResponse{
    let result = new ElectronicSignatureListResponse();
    if(response.code==="1"){
      const [signatures]= JSON.parse(response.payload as any);
      result.data = signatures.map((item:any, index: number)=>{
        return {
          index: index+1,
          idFirmaElectronica: item.idFirmaElectronica,
          nomEntidad: item.razonSocial,
          contrasenia: item.contrasenia,
          nombreArchivo: item.nombreArchivo,
          mimeType: item.mimeType,
          fechaCaducidad: item.fechaCaducidad,
          firma: item.firma,
        }
      })
    }

    return result;
  }
}
