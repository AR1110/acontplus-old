import { Quantity } from "@inventory/inventory-adjustment/domain/value-objects/quantity.vo";
import {Money} from "@inventory/inventory-adjustment/domain/value-objects/money.vo";
import {ProductId} from "@inventory/product/domain/product-id";
import {MedidaProducto} from "@inventory/domain/models/measure.model";

export class InventoryAdjustmentDetail {
  private constructor(
    private _orderIndex: number,
    private readonly _productId: ProductId,
    private readonly _code: string,
    private readonly _warehouseId: number,
    private readonly _unitOfMeasureId: number | null,
    private _measures: MedidaProducto[],
    private _quantity: Quantity,
    private _transactionQuantity: Quantity,
    private _unitConversion: Quantity,
    private _unitPrice: Money,
    private _costPrice: Money,
    private _fractionalCostPrice: Money,
    private _total: Money,
    private readonly _description: string,
    private _notes?: string
  ) {}

  static create(params: {
    orderIndex: number;
    productId: number;
    code: string;
    warehouseId: number;
    unitOfMeasureId?: number;
    measures: MedidaProducto[];
    quantity: number;
    transactionQuantity: number;
    unitConversion: number;
    unitPrice: number;
    costPrice: number;
    fractionalCostPrice: number;
    description: string;
    notes?: string;
  }): InventoryAdjustmentDetail {

    if (!params.description?.trim()) {
      throw new Error('Description cannot be empty');
    }

    // ✨ Value Objects creation with automatic validation
    const productId = ProductId.from(params.productId)
    const quantity = Quantity.from(params.quantity);
    const transactionQuantity = Quantity.from(params.transactionQuantity);
    const unitConversion = Quantity.from(params.unitConversion);
    const unitPrice = Money.from(params.unitPrice);
    const costPrice = Money.from(params.costPrice);
    const fractionalCostPrice = Money.from(params.fractionalCostPrice);

    const detail = new InventoryAdjustmentDetail(
      params.orderIndex,
      productId,
      params.code,
      params.warehouseId,
      params.unitOfMeasureId || null,
      params.measures,
      quantity,
      transactionQuantity,
      unitConversion,
      unitPrice,
      costPrice,
      fractionalCostPrice,
      Money.zero(),                        // ← Will be calculated
      params.description.trim(),
      params.notes?.trim()
    );
    detail.calculateTotal();
    return detail;
  }

  // Getters
  get orderIndex(): number { return this._orderIndex; }
  get productId(): ProductId { return this._productId; }
  get code(): string { return this._code; }
  get warehouseId(): number { return this._warehouseId; }
  get unitOfMeasureId(): number | null { return this._unitOfMeasureId; }
  get measures(): MedidaProducto[] { return this._measures; }
  get quantity(): Quantity { return this._quantity; }
  get transactionQuantity(): Quantity { return this._transactionQuantity; }
  get unitConversion(): Quantity { return this._unitConversion; }
  get unitPrice(): Money { return this._unitPrice; }
  get costPrice(): Money { return this._costPrice; }
  get fractionalCostPrice(): Money { return this._fractionalCostPrice; }
  get total(): Money { return this._total; }
  get description(): string { return this._description; }
  get notes(): string | undefined { return this._notes; }

  // ✨ Type-safe operations with Value Objects
  updateQuantity(newQuantity: number, newTransactionQuantity: number): void {
    this._quantity = Quantity.from(newQuantity);               // ← Automatic validation
    this._transactionQuantity = Quantity.from(newTransactionQuantity); // ← Automatic validation
    this.calculateTotal();
  }

  updatePricing(unitPrice: number, costPrice: number): void {
    this._unitPrice = Money.from(unitPrice);                   // ← Automatic validation
    this._costPrice = Money.from(costPrice);                   // ← Automatic validation
    this.calculateTotal();
  }

  updateOrderIndex(newIndex: number): void {
    this._orderIndex = newIndex;
  }

  private calculateTotal(): void {
    // ✨ Rich Value Object operations
    this._total = this._unitPrice.multiply(this._quantity.value);
  }

  getAdjustedCostValue(): Money {
    // ✨ Rich Value Object operations
    return this._costPrice.multiply(this._transactionQuantity.value);
  }

  // ✨ Business methods with Value Objects
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
      orderIndex: this._orderIndex,
      articleId: this._productId.value,
      code: this._code,
      warehouseId: this._warehouseId,
      unitOfMeasureId: this._unitOfMeasureId,
      measures: this._measures,
      quantity: this._quantity.value,
      transactionQuantity: this._transactionQuantity.value,
      unitPrice: this._unitPrice.value,
      costPrice: this._costPrice.value,
      total: this._total.value,
      description: this._description,
      notes: this._notes
    };
  }
}
