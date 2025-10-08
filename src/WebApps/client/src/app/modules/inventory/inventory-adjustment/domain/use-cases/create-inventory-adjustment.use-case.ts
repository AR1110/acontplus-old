import { inject, Injectable } from '@angular/core';
import { InventoryAdjustmentRepository } from '@inventory/inventory-adjustment/domain/repositories/inventory-adjustment.repository';
import { MedidaProducto } from '@inventory/domain/models/measure.model';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';

export interface CreateInventoryAdjustmentCommand {
  documentTypeId: number;
  transactionTypeId: number;
  codEstab: string;
  emissionPointId: number;
  emissionDate: Date;
  observations?: string;
  details: CreateInventoryAdjustmentDetailCommand[];
  total: number;
}

export interface CreateInventoryAdjustmentDetailCommand {
  id: number;
  orderIndex: number;
  productId: number;
  code: string;
  warehouseId: number;
  unitOfMeasureId: number;
  measures: MedidaProducto[];
  quantity: number;
  transactionQuantity: number;
  unitConversion: number;
  unitPrice: number;
  costPrice: number;
  fractionalCostPrice: number;
  description: string;
  notes?: string;
  total: number;
  status?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CreateInventoryAdjustmentUseCase
  implements BaseUseCase<ApiResponse, CreateInventoryAdjustmentCommand>
{
  private repository = inject(InventoryAdjustmentRepository);

  execute(command: CreateInventoryAdjustmentCommand) {
    return this.repository.create(command);
  }
}
