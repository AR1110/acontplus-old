export interface CreateInventoryAdjustmentDto {
  emissionPointId: number;
  documentType: any;
  transactionType: any;
  emissionDate: string;
  observations?: string;
  details: CreateInventoryAdjustmentDetailDto[];
}

export interface CreateInventoryAdjustmentDetailDto {
  articleId: number;
  warehouseId: number;
  unitOfMeasureId?: number;
  quantity: number;
  transactionQuantity: number;
  unitPrice: number;
  costPrice: number;
  description: string;
  notes?: string;
}

export interface InventoryAdjustmentDto {
  id: number;
  emissionPointId: number;
  documentType: any;
  transactionType: any;
  emissionDate: string;
  observations?: string;
  total: number;
  registrationDate: string;
  details: InventoryAdjustmentDetailDto[];
}

export interface InventoryAdjustmentDetailDto {
  orderIndex: number;
  articleId: number;
  warehouseId: number;
  unitOfMeasureId?: number;
  quantity: number;
  transactionQuantity: number;
  unitPrice: number;
  costPrice: number;
  total: number;
  description: string;
  notes?: string;
}
