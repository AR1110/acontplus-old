import { GuiaRemisionFilterData } from '@billing/domain/models/guia-remision/guia-remision.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';

export class GetGuiaRemisionFilterDataMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2,
    });
  }
  static fromJson(response: any): GuiaRemisionFilterData {
    const { ptoEmision, estadoDocumento: estadosDoc, users = [] } = response;

    const estabs = groupEstabUtil({
      isGroupPuntoEmision: true,
      estabs: ptoEmision,
    });
    console.log(response);

    return {
      estabs,
      estadosDoc,
      users,
    };
  }
}
