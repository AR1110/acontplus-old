import {formatDate} from "@core/utils/date.util";
import {DiscountType} from "@restaurant/domain/models/promotion";
import {generateUuidv4} from "@core/utils/generate-uuidv4";
import {mergeProductMeasures} from "@inventory/domain/utils/merge-measure.util";

export class PromotionGetByIdMapper {
  static fromJson(response: any) {
    const parsed = JSON.parse(response.payload as string);
    const {
      id,
      description,
      startDate,
      endDate,
      imageUrl,
      establishmentId,
      isActive,
      isDeleted,
      applicableDays,
      endTime,
      name,
      startTime,
      type
    } = parsed.promotions[0]
 //   console.log(res)
    const schedule = (JSON.parse(applicableDays) ?? []).map((day:any) => ({day}))
    const typeTemp: DiscountType["value"] = type === 1 ? 'fixed' : 'percentage';
    const promotion = {
      id,
      description,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      schedule,
      endTime,
      startTime,
      name,
      isActive,
      isDeleted,
      imageUrl,
      establishmentId,
      type: typeTemp
    }
    const details = parsed.details.map((item:any, index: number) => {
      const mainMeasures = JSON.parse(item.principal)
      const fractionalMeasures = JSON.parse(item.fractional)
      const measures = mergeProductMeasures(mainMeasures, fractionalMeasures);
      const dataMeasure = measures.find((x: any) => x.id === item.measureId);
      if(!dataMeasure){
        throw new Error('No se encontró la medida')
      }
      return {
        index: index + 1,
        uuid: generateUuidv4(),
        id: item.id,
        itemId: item.itemId,
        feeId: item.feeId,
        taxId: item.taxId,
        measureId: item.measureId,
        unitPrice: item.unitPrice,
        promotionalPrice: item.promotionalPrice,
        discountPercent: item.discountPercent,
        discount: item.discount,
        subtotal: item.subtotal,
        buyQuantity: item.buyQuantity,
        notes: item.notes,
        requiredQuantity: item.requiredQuantity,
        measures,
        fees: dataMeasure.fees,
        description: item.description,
        productCode: item.code,
        taxCode: item.taxCode,
      }
    })
    return {
      promotion,
      details
    };
  }
}
