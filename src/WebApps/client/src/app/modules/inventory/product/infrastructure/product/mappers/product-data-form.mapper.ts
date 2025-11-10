import { groupEstabUtil } from '@core/utils/group-estab.util';
import { groupSubCategoryUtil } from '@inventory/domain/utils/group-sub-category.util';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ProductDataFormMapper {
  static fromJson(response: ApiResponseLegacy) {
    const {
      brands,
      categories,
      decimal,
      fees,
      ice,
      measures,
      models,
      productTypes,
      subcategories,
      tags,
      taxes,
      warehouses,
    } = JSON.parse(response.payload as string);
    const estabs = groupEstabUtil({
      bodegas: warehouses,
      isGroupBodega: true,
    });

    return {
      categorias: categories,
      decimal: decimal[0],
      estabs,

      etiquetas: tags,
      marcas: brands,
      medidas: measures,
      modelos: models,
      subCategorias: subcategories,

      subCategoriasGroup: groupSubCategoryUtil(subcategories),

      tarifas: fees,
      tiposArticulo: productTypes,
      tiposIce: ice,
      tiposIva: taxes,
    };
  }
}
