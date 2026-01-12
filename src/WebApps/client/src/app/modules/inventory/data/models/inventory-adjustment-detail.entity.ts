import { MedidaProducto } from '@inventory/data/models/measure.model';

/**
 *
 *
 * @deprecated no usar
 */
export class InventoryAdjustmentDetail {
  private constructor(
    private _orderIndex: number,
    private readonly _productId: number,
    private readonly _code: string,
    private _warehouseId: number,
    private _unitOfMeasureId: number,
    private _measures: MedidaProducto[],
    private _quantity: number,
    private _transactionQuantity: number,
    private _unitConversion: number,
    private _unitPrice: number,
    private _costPrice: number,
    private _fractionalCostPrice: number,
    private _total: number,
    private readonly _description: string,
    private _notes?: string,
    private _status = true,
  ) {}

  static create(params: {
    orderIndex: number;
    productId: number;
    code: string;
    warehouseId: number;
    unitOfMeasureId: number;
    measures: MedidaProducto[];
    quantity: number;
    unitConversion: number;
    unitPrice: number;
    costPrice: number;
    fractionalCostPrice: number;
    description: string;
    notes?: string;
    status: boolean;
  }): InventoryAdjustmentDetail {
    if (!params.description?.trim()) {
      throw new Error('Description cannot be empty');
    }

    // Validation
    if (params.productId <= 0) {
      throw new Error('ProductPage ID must be a positive number');
    }
    if (params.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (params.unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }

    const detail = new InventoryAdjustmentDetail(
      params.orderIndex,
      params.productId,
      params.code,
      params.warehouseId,
      params.unitOfMeasureId,
      params.measures,
      params.quantity,
      0, // transactionQuantity - will be calculated
      params.unitConversion,
      params.unitPrice,
      params.costPrice,
      params.fractionalCostPrice,
      0, // total - will be calculated
      params.description.trim(),
      params.notes?.trim(),
      params.status,
    );

    return detail;
  }

  // Getters
  get orderIndex(): number {
    return this._orderIndex;
  }
  get productId(): number {
    return this._productId;
  }
  get code(): string {
    return this._code;
  }

  get warehouseId(): number {
    return this._warehouseId;
  }
  get unitOfMeasureId(): number | null {
    return this._unitOfMeasureId;
  }
  get measures(): MedidaProducto[] {
    return this._measures;
  }
  get quantity(): number {
    return this._quantity;
  }
  get transactionQuantity(): number {
    return this._transactionQuantity;
  }
  get unitConversion(): number {
    return this._unitConversion;
  }
  get unitPrice(): number {
    return this._unitPrice;
  }
  get costPrice(): number {
    return this._costPrice;
  }
  get fractionalCostPrice(): number {
    return this._fractionalCostPrice;
  }
  get total(): number {
    return this._total;
  }
  get description(): string {
    return this._description;
  }
  get notes(): string | undefined {
    return this._notes;
  }
  get status(): boolean {
    return this._status;
  }

  // Operations with numbers
  updateQuantity(newQuantity: number): void {
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    this._quantity = newQuantity;
    this.calculateTotal();
  }

  updateMeasure(unitOfMeasureId: number) {
    const dataMedida = this._measures.find((val) => val.idMedida === unitOfMeasureId);
    this._unitOfMeasureId = unitOfMeasureId;
    this._unitPrice = dataMedida?.precioUnitario || 0;
    this._costPrice = dataMedida?.precioCosto || 0;
    this._fractionalCostPrice = dataMedida?.precioCostoFraccionado || 0;
    this.calculateTotal();
  }

  updatePricing(unitPrice: number, costPrice: number): void {
    if (unitPrice < 0 || costPrice < 0) {
      throw new Error('Prices cannot be negative');
    }
    this._unitPrice = unitPrice;
    this._costPrice = costPrice;
    this.calculateTotal();
  }

  updateOrderIndex(newIndex: number): void {
    this._orderIndex = newIndex;
  }

  updateWarehouseId(newId: number): void {
    this._warehouseId = newId;
  }

  calculateTotal(): void {
    this._transactionQuantity = this._unitConversion * this._quantity;
    this._total = this._unitPrice * this._quantity;
  }

  getAdjustedCostValue(): number {
    return this._costPrice * this._transactionQuantity;
  }

  isQuantitySufficient(required: number): boolean {
    return this._quantity >= required;
  }

  applyDiscount(percentage: number): number {
    return this._unitPrice * (1 - percentage / 100);
  }

  getQuantityRatio(): number {
    if (this._quantity === 0) {
      throw new Error('Cannot calculate ratio with zero quantity');
    }
    return this._transactionQuantity / this._quantity;
  }

  toPlainObject() {
    return {
      orderIndex: this.orderIndex,
      productId: this.productId,
      code: this.code,
      warehouseId: this.warehouseId,
      unitOfMeasureId: this.unitOfMeasureId,
      measures: this.measures,
      quantity: this.quantity,
      transactionQuantity: this.transactionQuantity,
      unitConversion: this.unitConversion,
      fractionalCostPrice: this.fractionalCostPrice,
      unitPrice: this.unitPrice,
      costPrice: this.costPrice,
      total: this.total,
      description: this.description,
      notes: this.notes,
      status: this._status,
    };
  }
}
