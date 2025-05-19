import {groupEstabUtil} from "@core/utils/group-estab.util";
import {DataFilterCuentaPorCobrarResponse} from "@accounting/domain/models/cuenta-por-cobrar.model";

export class DataFilterCuentaPorCobrarMapper {
  static toJson(){
    return JSON.stringify({ tipo: 6 })
  }

  static fromJson(response:any): DataFilterCuentaPorCobrarResponse{
    const {
      establecimientos,
      estadoPago,
      tipoDocumento,
      empresas,
      ciudades,
      users
    } = response;
    let estabs = groupEstabUtil({
      estabs: establecimientos || [],
      isGroupPuntoEmision: true,
    });

    return {
      estabs,
      estadosDoc: estadoPago || [],
      tiposDoc: tipoDocumento || [],
      empresas: empresas || [],
      ciudades: ciudades || [],
      users: users || [],
    };

  }
}
