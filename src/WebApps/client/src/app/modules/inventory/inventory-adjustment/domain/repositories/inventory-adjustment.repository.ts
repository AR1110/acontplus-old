import {Observable} from "rxjs";
import {
  InventoryAdjustmentDetailResponse,
  InventoryAdjustmentFormDataResponse, InventoryAdjustmentListProductsResponse,
  InventoryAdjustmentListResponse
} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";

export abstract class InventoryAdjustmentRepository {
  abstract list(params:any):Observable<InventoryAdjustmentListResponse>;
  abstract formData():Observable<InventoryAdjustmentFormDataResponse>;
  abstract detail(id:number):Observable<InventoryAdjustmentDetailResponse>;
  abstract listProducts(params:any):Observable<InventoryAdjustmentListProductsResponse>;
}
