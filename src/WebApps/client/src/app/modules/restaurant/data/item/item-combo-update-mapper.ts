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
