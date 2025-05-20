
import {
  SolicitudAutorizacionFilterResponse,
} from "@modules/config/domain/models/solicitud-autorizacion.model";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {ApiResponse} from "@core/models/api-response";

export class FilterSolicitudAutorizacionMapper {

  static toJson(){
    return JSON.stringify( {
      tipo: 3
    })
  }
  static fromJson(response: ApiResponse): SolicitudAutorizacionFilterResponse {
    const payload= JSON.parse(response.payload as any)

      let estabs = groupEstabUtil({
        estabs: payload.estabs,
        isGroupPuntoEmision: true
      })

      return {
        estabs: estabs,
        usersRole: payload.usersRole
      }


  }
}
