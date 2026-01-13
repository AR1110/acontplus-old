import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { FilterDataCuentaPorPagarResponse } from '@accounting/data/models/cuenta-por-pagar.model';

export class GetFilterDataCuentaPorPagarMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 6,
    });
  }
  static fromJson(response: ApiResponseLegacy) {
    const resultData = new FilterDataCuentaPorPagarResponse();

    if (response.code === '1') {
      const [tempEstabs, tempEstadosDoc, tempTiposDoc, tempCategorias] = JSON.parse(
        response.payload as string,
      );

      const dataToGroup = {
        estabs: tempEstabs,
        isGroupPuntoEmision: true,
      };
      resultData.estabs = groupEstabUtil(dataToGroup);
      resultData.estadosDoc = tempEstadosDoc;
      resultData.tiposDoc = tempTiposDoc;
      resultData.categorias = tempCategorias;
    }

    return resultData;
  }
}
