import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { groupSubCategoryUtil } from '@inventory/domain/utils/group-sub-category.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ProductSearch } from '@inventory/domain/models/product.entity';
import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';

export class TagMapper {
  static fromApiGetAll(response: any) {
    const tags = response.tags || [];
    return tags.map((item: any) => {
      return {
        idEtiqueta: item.idEtiqueta,
        descripcion: item.descripcion,
        etiquetas: item.etiquetas,
        estado: item.estado,
      };
    });
  }
}
