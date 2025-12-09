import { mergeProductMeasures } from '@inventory/domain/utils/merge-measure.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

export class ItemGetByIdMapper {

  static toJson(params: any) {
    return params;
  }

  static fromJson(response: any) {
    const { item, itemCompositions = [] } = JSON.parse(response.payload as string);

    const { id, title, cooking, forPromotion, summary, recipe, instructions } = item[0];

   console.log(itemCompositions)
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
    console.log(tree);

    // ✅ 4. RESPUESTA FINAL LIMPIA
    return {
      item: {
        id,
        summary,
        recipe,
        instructions,
        title,
        cooking,
        forPromotion,
        isActive: true,
      },
      itemCompositions: tree
    };
  }
}
