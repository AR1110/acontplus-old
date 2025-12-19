import { inject, Injectable } from '@angular/core';
import { CreateInventoryAdjustmentCommand } from '@inventory/domain/models/inventory-adjustment.model';
import { PRODUCT_SERVICE, INVENTORY_ADJUSTMENT_SERVICE } from '@inventory/tokens/inventory-token';
import { InventoryAdjustmentStore } from '@inventory/domain/store/inventory-adjustment.store';
import { DialogService } from '@core/services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryAdjustmentService {
  readonly inventoryAdjustmentService = inject(INVENTORY_ADJUSTMENT_SERVICE);
  readonly productService = inject(PRODUCT_SERVICE);
  readonly inventoryAdjustmentStore = inject(InventoryAdjustmentStore);
  readonly dialogSvc = inject(DialogService);

  // Main CRUD operations

  getFormData() {
    return this.inventoryAdjustmentService.formData();
  }
  getAll(filters?: {
    pageIndex: number;
    pageSize: number;
    useFilterDate: boolean;
    startDate: string;
    endDate: string;
    serie: string | null;
    tipoDocId?: number | null;
    textSearch?: string | null;
  }) {
    return this.inventoryAdjustmentService.list(filters);
  }

  // getById(id: number): Observable<InventoryAdjustment | null> {
  //   return this.getByIdUseCase.execute(id);
  // }

  create(command: CreateInventoryAdjustmentCommand) {
    return this.inventoryAdjustmentService.create(command);
  }

  // update(command: UpdateInventoryAdjustmentCommand): Observable<InventoryAdjustment> {
  //   return this.updateUseCase.execute(command);
  // }
  //
  // delete(id: number): Observable<void> {
  //   return this.deleteUseCase.execute(id);
  // }

  // removeDetail(command: RemoveDetailFromAdjustmentCommand): Observable<InventoryAdjustment> {
  //   return this.removeDetailUseCase.execute(command);
  // }

  // Business operations
  // calculateInventoryImpact(adjustmentId: number): Observable<Map<number, Quantity>> {
  //   return this.calculateImpactUseCase.execute(adjustmentId);
  // }

  getProductById(id: number) {
    return this.productService.getForPurchase(id);
  }

  getProductListImported(params: any) {
    return this.inventoryAdjustmentService.listProducts(params);
  }

  viewDetail(id: number) {
    return this.inventoryAdjustmentService.detail(id);
  }
}
