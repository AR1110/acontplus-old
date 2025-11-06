import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { GroupedEstab } from '@core/models/estab.model';

export class ProformaInvoiceFilterMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 3,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    const result = {
      estabs: [] as GroupedEstab[],
    };
    const { estabs } = JSON.parse(response.payload as string);
    result.estabs = groupEstabUtil({
      estabs,
      isGroupPuntoEmision: true,
    });

    return result;
  }
}
