import {Observable} from "rxjs";
import {
  InventoryAdjustmentDetailResponse,
  InventoryAdjustmentFormDataResponse,
  InventoryAdjustmentListResponse
} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";

export abstract class InventoryAdjustmentRepository {
  abstract list(params:any):Observable<InventoryAdjustmentListResponse>;
  abstract formData():Observable<InventoryAdjustmentFormDataResponse>;
  abstract detail(id:number):Observable<InventoryAdjustmentDetailResponse>;
}
