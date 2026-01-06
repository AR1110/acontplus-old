import { PagedResult, PaginationParams } from '@acontplus/core';
import { mergeProductMeasures } from '@inventory/utils/merge-measure.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

export class ItemListMapper {
  static toJson(params: PaginationParams) {
    const queryParams = new URLSearchParams({
      pageIndex: params.pageIndex.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    // if (params.sortDirection) {
    //   queryParams.append('sortDirection', params.sortDirection);
    // }
    if (params.filters) {
      const objToJsonFilters: Record<string, string> = {
        categoryAbbreviations: 'sigla',
        categoryAbbreviation: 'sigla',
      };
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value == null) return; // 🔹 salta este item, pero sigue con los demás
        const filterKey = objToJsonFilters[key] || key;
        queryParams.append(`filters[${filterKey}]`, String(value));
      });
    }
    return queryParams.toString();
  }

  static fromJson(response: PagedResult<any>): PagedResult<any> {
    const results: PagedResult<any> = {
      ...response,
      items: [],
    };
    results.items = response.items.map((item: any, index: number) => {
      return {
        index: index + 1,
        id: item.id,
        acronymCategory: item.acronymFamily,
        productId: item.productId,
        title: item.title,
        summary: item.summary,
        imageUrl: item.s3ObjectUrl,
        description: item.description,
        code: item.code,
        measure: item.measure,
        auxiliaryCode: item.auxiliary_code,
        costPrice: item.costPrice,
        category: item.category,
      };
    });

    return results;
  }
}


// item combo update mapper
export class ItemComboUpdateMapper {
  static toJson(params: any) {
    const { item, itemCompositions } = params;

    return {
      summary: item.summary,
      requiresCooking: item.cooking,
      isActive: item.isActive,
      compositions: itemCompositions.map((item: any, index: number) => ({
        index: index + 1,
        uniqueId: item.parentUuid ? item.parentUuid: item.uuid,

        id: item.id,
        parentItemId: item.parentItemId,
        childItemId: item.childItemId,
        parentCompositionId: item.parentCompositionId || null,
        //    parentCompositionId: item.isOptional ? null: item.id || null,

        quantity: item.quantity,
        unitPrice: item.unitPrice,
        feeId: item.feeId,
        salePrice: item.salePrice,
        measureId: item.measureId,
        totalPrice: item.salePrice * item.quantity,
        totalCost: item.unitPrice * item.quantity,
        isActive: item.isActive,
        isDeleted: item.isDeleted,
        isOptional: item.isOptional,

      })),
    };
  }
  static fromJson(json: any) {}
}


// item get id mapper

export class ItemGetByIdMapper {

  static toJson(params: any) {
    return params;
  }

  static fromJson(response: any) {
    const { item, itemCompositions = [] } = JSON.parse(response.payload as string);

    const { id, title, cooking, forPromotion, summary, preparationInstructions } = item[0];


    const flatMapped = itemCompositions.map((item: any) => {
      const mainMeasures = JSON.parse(item.principal);
      const fractionalMeasures = JSON.parse(item.fractional);
      const measures = mergeProductMeasures(mainMeasures, fractionalMeasures);

      const dataMeasure = measures.find((x: any) => x.id === item.measureId);
      const fees = dataMeasure?.fees ?? [];

      return {
        uuid: item.uniqueId ?? generateUuidv4(),
        id: item.id,
        parentCompositionId: item.parentCompositionId, // ✅ CLAVE
        parentUuid: null as string | null,             // ✅ SE LLENA LUEGO
        childItemId: item.childItemId,
        feeId: item.feeId,
        fees,
        measureId: item.measureId,
        quantity: item.quantity,
        salePrice: item.salePrice,
        unitPrice: item.unitPrice,
        description: item.description,
        totalPrice: item.totalPrice,
        totalCost: item.totalCost,
        code: item.code,
        measures,
        isActive: true,
        level: 0,
        children: [],
        isOptional: item.isOptional
      };
    });

    // ✅ 2. MAPA POR ID (para padres rápidos)
    const map = new Map<number, any>();
    flatMapped.forEach((item:any) => map.set(item.id, item));

    // ✅ 3. CONSTRUIR ÁRBOL + parentUuid + level
    const tree: any[] = [];

    flatMapped.forEach((item:any) => {
      if (item.parentCompositionId===null) {
        item.level = 0;
        item.parentUuid = null;
        tree.push(item);
      } else {
        const parent = map.get(item.parentCompositionId);
        if (parent) {
          item.parentUuid = parent.uuid;
          item.level = parent.level + 1;
          parent.children.push(item);
        }
      }
    });

    // ✅ 4. RESPUESTA FINAL LIMPIA
    return {
      item: {
        id,
        summary,
        preparationInstructions,
        title,
        cooking,
        forPromotion,
        isActive: true,
      },
      itemCompositions: tree
    };
  }
}



//item update mapper
export class ItemUpdateMapper {
  static toJson(params: any) {
    const { item, itemCompositions } = params;

    return {
      summary: item.summary,
      cooking: item.cooking,
      recipe: item.recipe,
      preparationInstructions: item.preparationInstructions,
      isActive: item.isActive,
      compositions: itemCompositions.map((item: any, index: number) => ({
        index: index + 1,
        uniqueId: item.id > 0 ? item.uuid : item.parentUuid,
        id: item.id,
        itemId: item.itemId,
        parentCompositionId: item.parentCompositionId || null,
        //  parentCompositionId:  item.isOptional ? null: item.id || null,

        childItemId: item.childItemId,
        quantity: item.quantity,
        price: item.price,
        costPrice: item.costPrice,
        measureId: item.measureId,
        subtotal: item.subtotal,
        isActive: item.isActive,
        isDeleted: item.isDeleted,
        isOptional: item.isOptional,
      })),
    };
  }
  static fromJson(json: any) {}
}
