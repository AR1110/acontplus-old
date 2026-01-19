import {ApiResponse} from "acontplus-utils";
import {ListLicenseAccessResponse} from "@modules/seguridad/domain/models/licencia-acceso";

export class LicenseAccessMapper {

  static toJson(params:any){
    return JSON.stringify({
      tipo: 1,
      ...params
    })
  }

  static fromJson(response:ApiResponse): ListLicenseAccessResponse{
    const result = new ListLicenseAccessResponse()
    console.log(response);
    const {accesses=[]} = JSON.parse(response.payload as string);
    console.log(accesses)
    result.data = accesses.map((item:any, index:number)=>{
      return {
        index: index+1,
        "id": item.id,
        "isActive": item.isActive,
        "deleted": item.deleted,
        "licenciaId": item.licenciaId,
        "licenseTypeId": item.licenseTypeId,
        "licenseTypeName": item.licenseType,
        "roleId": item.roleId,
        "name": item.name
      }
    })
    return result;
  }
}
