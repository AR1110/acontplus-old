import { GuiaRemisionFilterData } from '@modules/billing/domain/models/guia-remision.model';
import {groupEstabUtil} from "@core/utils/group-estab.util";

export class GetGuiaRemisionFilterDataMapper {
  static fromJson(response: any): GuiaRemisionFilterData {
    const {ptoEmision, estadoDocumento: estadosDoc} = response;

    const estabs = groupEstabUtil({
      isGroupPuntoEmision: true,
      estabs: ptoEmision
    })
    console.log(response);

    return {
      estabs ,
      estadosDoc,
    };
  }
}
