import { Quantity } from '@inventory/inventory-adjustment/domain/value-objects/quantity.vo';
import { Money } from '@inventory/inventory-adjustment/domain/value-objects/money.vo';
import { ProductId } from '@inventory/domain/product-id';
import { MedidaProducto } from '@inventory/domain/models/measure.model';

export class InventoryAdjustmentDetail {
  private constructor(
    private _orderIndex: number,
    private readonly _productId: ProductId,
    private readonly _code: string,
    private _warehouseId: number,
    private _unitOfMeasureId: number,
    private _measures: MedidaProducto[],
    private _quantity: Quantity,
    private _transactionQuantity: Quantity,
    private _unitConversion: Quantity,
    private _unitPrice: Money,
    private _costPrice: Money,
    private _fractionalCostPrice: Money,
    private _total: Money,
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

    // ✨ Value Objects creation with automatic validation
    const productId = ProductId.from(params.productId);
    const quantity = Quantity.from(params.quantity);
    const unitConversion = Quantity.from(params.unitConversion);
    const unitPrice = Money.from(params.unitPrice);
    const costPrice = Money.from(params.costPrice);
    const fractionalCostPrice = Money.from(params.fractionalCostPrice);

    const detail = new InventoryAdjustmentDetail(
      params.orderIndex,
      productId,
      params.code,
      params.warehouseId,
      params.unitOfMeasureId,
      params.measures,
      quantity,
      Quantity.zero(),
      unitConversion,
      unitPrice,
      costPrice,
      fractionalCostPrice,
      Money.zero(), // ← Will be calculated
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
  get productId(): ProductId {
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
  get quantity(): Quantity {
    return this._quantity;
  }
  get transactionQuantity(): Quantity {
    return this._transactionQuantity;
  }
  get unitConversion(): Quantity {
    return this._unitConversion;
  }
  get unitPrice(): Money {
    return this._unitPrice;
  }
  get costPrice(): Money {
    return this._costPrice;
  }
  get fractionalCostPrice(): Money {
    return this._fractionalCostPrice;
  }
  get total(): Money {
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

  // ✨ Type-safe operations with Value Objects
  updateQuantity(newQuantity: number): void {
    this._quantity = Quantity.from(newQuantity);
    this.calculateTotal();
  }

  updateMeasure(unitOfMeasureId: number) {
    console.log('udpate meadoe', unitOfMeasureId);
    const dataMedida = this._measures.find((val) => val.idMedida === unitOfMeasureId);
    this._unitOfMeasureId = unitOfMeasureId;
    this._unitPrice = Money.from(dataMedida?.precioUnitario || 0);
    this._costPrice = Money.from(dataMedida?.precioCosto || 0);
    this._fractionalCostPrice = Money.from(dataMedida?.precioCostoFraccionado || 0);
    this.calculateTotal();
  }

  updatePricing(unitPrice: number, costPrice: number): void {
    this._unitPrice = Money.from(unitPrice);
    this._costPrice = Money.from(costPrice);
    this.calculateTotal();
  }

  updateOrderIndex(newIndex: number): void {
    this._orderIndex = newIndex;
  }

  updateWarehouseId(newId: number): void {
    this._warehouseId = newId;
  }

  calculateTotal(): void {
    this._transactionQuantity = this._unitConversion.multiply(this._quantity.value);
    this._total = this._unitPrice.multiply(this._quantity.value);
  }

  getAdjustedCostValue(): Money {
    // ✨ Rich Value Object operations
    return this._costPrice.multiply(this._transactionQuantity.value);
  }

  isQuantitySufficient(required: Quantity): boolean {
    return this._quantity.canSatisfy(required);
  }

  applyDiscount(percentage: number): Money {
    return this._unitPrice.multiply(1 - percentage / 100);
  }

  getQuantityRatio(): number {
    return this._transactionQuantity.ratioTo(this._quantity);
  }

  toPlainObject() {
    return {
      orderIndex: this.orderIndex,
      productId: this.productId.value,
      code: this.code,
      warehouseId: this.warehouseId,
      unitOfMeasureId: this.unitOfMeasureId,
      measures: this.measures,
      quantity: this.quantity.value,
      transactionQuantity: this.transactionQuantity.value,
      unitConversion: this.unitConversion.value,
      fractionalCostPrice: this.fractionalCostPrice.value,
      unitPrice: this.unitPrice.value,
      costPrice: this.costPrice.value,
      total: this.total.value,
      description: this.description,
      notes: this.notes,
      status: this._status,
    };
  }
}
