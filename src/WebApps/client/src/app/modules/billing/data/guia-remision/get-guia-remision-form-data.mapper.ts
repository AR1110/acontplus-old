import {
  GuiaRemisionDataForm,
  GuiaRemisionFilterData,
} from '@billing/domain/models/guia-remision/guia-remision.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';

export class GetGuiaRemisionFormDataMapper {
  static fromJson(response: any): GuiaRemisionDataForm {
    const { ptoEmision, tipoDocumento, infoAdicional = [] } = response;

    const estabs = groupEstabUtil({
      isGroupPuntoEmision: true,
      estabs: ptoEmision,
    });
    console.log(response);
    const informacionesAdicionales = infoAdicional.map((item: any) => {
      return {
        ...item,
        infoAdicional: item.infoAdicional ? JSON.parse(item.infoAdicional) : [],
      };
    });

    return {
      estabs,
      tiposDoc: tipoDocumento,
      informacionesAdicionales,
    };
  }
}
