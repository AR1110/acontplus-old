import {ApiResponse} from "@core/models/api-response";
import {FormDataControlCajaResponse} from "@accounting/caja/domain/control-caja.entity";

export class FormDataControlCajaMapper {

  static toJson( ){
    return JSON.stringify({ tipo: 2 })
  }

  static fromJson(response:ApiResponse):FormDataControlCajaResponse{
    const result = new FormDataControlCajaResponse()
    const data = JSON.parse(response.payload as string);

    result.formaPagos = data.formaPagos||[]
    result.tipoDocumento = data.tipoDocumento||[]
    return result;
  }

}
