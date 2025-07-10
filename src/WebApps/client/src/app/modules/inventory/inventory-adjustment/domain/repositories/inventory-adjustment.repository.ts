import {Observable} from "rxjs";
import {
  CreateInventoryAdjustmentCommand
} from "@inventory/inventory-adjustment/domain/use-cases/create-inventory-adjustment.use-case";
import {ApiResponse} from "@core/models/api-response";
import {
  InventoryAdjustmentDetailDto,
  InventoryAdjustmentFormDataDto,  InventoryAdjustmentListProductsDto, InventoryAdjustmentListResultDto
} from "@inventory/inventory-adjustment/domain/dtos/inventory-adjustment.dto";

export abstract class InventoryAdjustmentRepository {
  abstract list(params:any):Observable<InventoryAdjustmentListResultDto>;
  abstract formData():Observable<InventoryAdjustmentFormDataDto>;
  abstract detail(id:number):Observable<InventoryAdjustmentDetailDto>;
  abstract listProducts(params:any):Observable<InventoryAdjustmentListProductsDto>;
  abstract create(params:CreateInventoryAdjustmentCommand):Observable<ApiResponse>
}
