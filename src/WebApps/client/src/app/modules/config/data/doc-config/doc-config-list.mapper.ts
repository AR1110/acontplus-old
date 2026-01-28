import { DocConfigListResponse } from '@modules/config/data/models/doc-config.model';

export class DocConfigListMapper {
  static toJson(puntoEmisionId: number) {
    return JSON.stringify({
      tipo: 1,
      idPuntoEmision: puntoEmisionId,
    });
  }

  static fromJson(response: any): DocConfigListResponse {
    const { docs = [] } = response;
    const data = docs.map((item: any, index: number) => {
      return {
        index: index + 1,
        idConfiguracionDocumento: item.idConfiguracionDocumento,
        idTipoDocumento: item.idTipoDocumento,
        ultimaSecuencia: item.ultimaSecuencia,
        nomDoc: item.descripcion,
        estado: item.estado,
        hasInfoAdicional: item.infoAdicional,
      };
    });
    return {
      data,
    };
  }
}
