export class ItemUpdateMapper {
  static toJson(params: any) {
    const { item, itemCompositions } = params;

    return {
      item: {
        summary: item.summary,
        cooking: item.cooking,
        recipe: item.recipe,
        instructions: item.instructions,
        isActive: item.isActive,
      },
      itemComposition: itemCompositions.map((item: any, index: number) => ({
        index: index + 1,
        uniqueId: item.id> 0 ?item.uuid:  item.parentUuid,
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
