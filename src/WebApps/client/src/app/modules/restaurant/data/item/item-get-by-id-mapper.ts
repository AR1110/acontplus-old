import { mergeProductMeasures } from '@inventory/domain/utils/merge-measure.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

export class ItemGetByIdMapper {
  static toJson(params: any) {
    return params;
  }

  static fromJson(response: any) {
    const { item, itemCompositions = [] } = JSON.parse(response.payload as string);

    const { id, title, cooking, forPromotion, summary, recipe, instructions } = item[0];

    console.log(item);
    console.log(itemCompositions);

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
      itemCompositions: itemCompositions.map((item: any, index: number) => {
        const mainMeasures = JSON.parse(item.principal);
        const fractionalMeasures = JSON.parse(item.fractional);
        const measures = mergeProductMeasures(mainMeasures, fractionalMeasures);

        const dataMeasure = measures.find((x: any) => x.id === item.measureId);

        console.log(item);
        const fees = dataMeasure?.fees ?? [];

        return {
          uuid: item.uniqueId ?? generateUuidv4(),
          id: item.id,
          //  parentItemId: item.parentItemId,
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
        };
      }),
    };
  }
}
