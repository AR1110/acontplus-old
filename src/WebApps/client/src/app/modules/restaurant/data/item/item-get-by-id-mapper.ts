import {mergeProductMeasures} from "@inventory/domain/utils/merge-measure.util";
import {generateUuidv4} from "@core/utils/generate-uuidv4";

export class ItemGetByIdMapper {
  static toJson(params: any) {
    return params;
  }

  static fromJson(response: any) {
    const {item, itemCompositions} = JSON.parse(response.payload as string);


    console.log(item);
    console.log(itemCompositions);

    return {
      item,
      itemCompositions: itemCompositions.map((item:any, index: number) => {
        const  mainMeasures = JSON.parse(item.principal)
        const fractionalMeasures = JSON.parse(item.fractional)
        const measures  = mergeProductMeasures(mainMeasures, fractionalMeasures)

        return {
          uuid: item.uniqueId ?? generateUuidv4(),
          id: item.id,
          feeId: item.feeId,
          taxRateId: item.taxId, //id tipo impuesto
          measureId: item.measureId,
          quantity: item.quantity,
          price: item.price,
          costPrice: item.costPrice,
          discount: item.discount,
          discountPercent: item.discountPercent,
          subtotal: item.subtotal,
          weight: item.weight,
          summary: item.summary,
          description: item.description,
          code: item.code,
          codePercentaje: item.codePercentaje,
          measures,
        }


      })
    }

    }

}
