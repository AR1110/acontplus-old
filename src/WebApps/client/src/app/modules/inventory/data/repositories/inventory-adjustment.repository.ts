import { Observable } from 'rxjs';
import { CreateInventoryAdjustmentCommand } from '@inventory/data/models/inventory-adjustment.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  InventoryAdjustmentDetailDto,
  InventoryAdjustmentFormDataDto,
  InventoryAdjustmentListProductsDto,
  InventoryAdjustmentListResultDto,
} from '@inventory/data/dtos/inventory-adjustment.dto';

export interface InventoryAdjustmentRepository {
  list(params: any): Observable<InventoryAdjustmentListResultDto>;
  formData(): Observable<InventoryAdjustmentFormDataDto>;
  detail(id: number): Observable<InventoryAdjustmentDetailDto>;
  listProducts(params: any): Observable<InventoryAdjustmentListProductsDto>;
  create(params: CreateInventoryAdjustmentCommand): Observable<ApiResponseLegacy>;
}
