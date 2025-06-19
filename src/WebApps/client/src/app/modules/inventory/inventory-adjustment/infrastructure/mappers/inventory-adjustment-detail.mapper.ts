import {
  InventoryAdjustmentDetailResponse,
} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";

export class InventoryAdjustmentDetailMapper {
  static toJson(id:number){

    return JSON.stringify({
      tipo: 3,
      id
    })
  }

  static fromJson(response:any): InventoryAdjustmentDetailResponse{
    const result = new InventoryAdjustmentDetailResponse();
    console.log(result)
    return result;
  }
}
