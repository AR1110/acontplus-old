import { formatDate } from '@core/utils/date.util';
import { DiscountType } from '@restaurant/domain/models/promotion';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { mergeProductMeasures } from '@inventory/utils/merge-measure.util';

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
      type,
    } = parsed.promotions[0];
    //   console.log(res)
    console.log(JSON.parse(applicableDays));
    const toDate = (timeString: string): Date => {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    };
    const schedule = (JSON.parse(applicableDays) ?? []).map((day: any) => {
      return {
        day: day.day,
        isActive: day.isActive,
        startTime: toDate(day.startTime),
        endTime: toDate(day.endTime),
      };
    });
    const typeTemp: DiscountType['value'] = type === 1 ? 'fixed' : 'percentage';
    const promotion = {
      id,
      description,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      schedule,
      endTime,
      startTime,
      name,
      isActive: isActive ?? true,
      isDeleted,
      imageUrl,
      establishmentId,
      type: typeTemp,
    };
    const details = (parsed.details ?? []).map((item: any, index: number) => {
      const mainMeasures = JSON.parse(item.principal);
      const fractionalMeasures = JSON.parse(item.fractional);
      const measures = mergeProductMeasures(mainMeasures, fractionalMeasures);
      const dataMeasure = measures.find((x: any) => x.id === item.measureId);
      if (!dataMeasure) {
        throw new Error('No se encontró la medida');
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
        quantity: item.buyQuantity ?? 1,
        notes: item.notes,
        requiredQuantity: item.requiredQuantity,
        measures,
        fees: dataMeasure.fees,
        description: item.description,
        productCode: item.code,
        taxCode: item.taxCode,
        isActive: item.isActive ?? true,
      };
    });
    return {
      promotion,
      details,
    };
  }
}
