import { formatDateToString, getTimeString } from '@core/utils/date.util';

export class PromotionSaveMapper {
  static toJson(model: any) {
    const applicableDays = model.schedule
      .map((x: any) => {
        return {
          day: x.day,
          isActive: x.isActive,
          startTime: getTimeString(x.startTime),
          endTime: getTimeString(x.endTime),
        };
      })
      .filter((x: any) => x.isActive);

    const details = model.selectedProducts.map((x: any) => {
      return {
        ...x,
        buyQuantity: x.quantity,
      };
    });

    return {
      establishmentId: model.establishmentId,
      name: model.name,
      description: model.description ?? null,
      startDate: formatDateToString(model.startDate),
      endDate: formatDateToString(model.endDate),
      applicableDays: JSON.stringify(applicableDays),
      startTime: model.startTime,
      endTime: model.endTime,
      type: model.type === 'fixed' ? 1 : 2,
      discountPercent: model.value ?? 0,
      isActive: model.isActive,

      details,
    };
  }
}
