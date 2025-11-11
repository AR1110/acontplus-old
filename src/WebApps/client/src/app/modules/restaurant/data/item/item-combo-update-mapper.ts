export class ItemComboUpdateMapper {

  static toJson(params: any) {
    const {item, itemCompositions} = params;

    return {
      item: {
        title: item.title,
        summary: item.summary
        ,cooking: item.cooking
        ,forPromotion: item.forPromotion,
        isActive: item.isActive,
      },
      itemComposition: itemCompositions.map((item:any, index: number) => ( {
          index: index + 1,
          uniqueId: item.uuid,
          id: item.id,
          itemId: item.itemId,
          childItemId: item.childItemId,
          quantity: item.quantity,
          costPrice: item.costPrice,
          feeId: item.feeId,
          taxId: item.taxRateId,
          price: item.price,
          measureId: item.measureId,
          subtotal: item.subtotal,
          discount: item.discount,
          discountPercent: item.discountPercent,
          isActive: item.isActive,
          isDeleted: item.isDeleted
        }
      ))
    };

  }
  static fromJson(json: any) {

  }
}
