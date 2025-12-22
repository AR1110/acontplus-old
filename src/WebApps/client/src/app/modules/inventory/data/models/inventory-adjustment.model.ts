import { MedidaProducto } from '@inventory/data/models/measure.model';

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
