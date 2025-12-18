import { inject, Injectable } from '@angular/core';
import {
  CreateInventoryAdjustmentCommand,
  CreateInventoryAdjustmentUseCase,
} from '@inventory/inventory-adjustment/domain/use-cases/create-inventory-adjustment.use-case';

import { PRODUCT_SERVICE } from '@inventory/tokens/inventory-token';
import { InventoryAdjustmentStore } from '@inventory/inventory-adjustment/domain/store/inventory-adjustment.store';
import { DialogService } from '@core/services/dialog.service';
import {
  GetAllInventoryAdjustmentsUseCase,
  InventoryAdjustmentDetailUseCase,
  InventoryAdjustmentFormDataUseCase,
  InventoryAdjustmentListProductsUseCase,
} from '@inventory/inventory-adjustment/domain/use-cases/get-inventory-adjusment.use-case';

@Injectable({
  providedIn: 'root',
})
export class InventoryAdjustmentService {
  readonly createUseCase = inject(CreateInventoryAdjustmentUseCase);
  readonly getAllUseCase = inject(GetAllInventoryAdjustmentsUseCase);
  readonly formDataUseCase = inject(InventoryAdjustmentFormDataUseCase);
  readonly productService = inject(PRODUCT_SERVICE);
  readonly inventoryAdjustmentListProductsUseCase = inject(InventoryAdjustmentListProductsUseCase);
  readonly inventoryAdjustmentDetailUseCase = inject(InventoryAdjustmentDetailUseCase);
  readonly inventoryAdjustmentStore = inject(InventoryAdjustmentStore);
  readonly dialogSvc = inject(DialogService);

  // Main CRUD operations

  getFormData() {
    return this.formDataUseCase.execute();
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
    return this.getAllUseCase.execute(filters);
  }

  // getById(id: number): Observable<InventoryAdjustment | null> {
  //   return this.getByIdUseCase.execute(id);
  // }

  create(command: CreateInventoryAdjustmentCommand) {
    return this.createUseCase.execute(command);
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
    return this.inventoryAdjustmentListProductsUseCase.execute(params);
  }

  viewDetail(id: number) {
    return this.inventoryAdjustmentDetailUseCase.execute(id);
  }
}
