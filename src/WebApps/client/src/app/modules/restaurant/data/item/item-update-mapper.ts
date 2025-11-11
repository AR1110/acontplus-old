export class ItemUpdateMapper {

  static toJson(params: any) {
    const {item, itemCompositions} = params;

    return {
      item: {
        summary: item.summary
        ,cooking: item.cooking
        ,recipe: item.recipe
        ,instructions: item.instructions
        ,content: item.content
        ,unit: item.unit
        ,forPromotion: item.forPromotion
        ,quantity : item.quantity
        ,title: item.title,
        isActive: item.isActive,
      },
      itemComposition: itemCompositions.map((item:any, index: number) => ( {

          index: index + 1,
          uniqueId: item.uuid,
          id: item.id,
          itemId: item.itemId,
          childItemId: item.childItemId,
          quantity: item.quantity,
          isActive: item.isActive,
          costPrice: item.costPrice,
          feeId: item.feeId,
          taxId: item.taxRateId,
          measureId: item.measureId,
        }
      ))
    };

  }
  static fromJson(json: any) {

  }
}
