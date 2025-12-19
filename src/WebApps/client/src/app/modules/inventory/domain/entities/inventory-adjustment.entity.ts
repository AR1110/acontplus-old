import { ValidationException } from '@core/domain/domain-exception';
import { InventoryAdjustmentDetail } from '@inventory/domain/entities/inventory-adjustment-detail.entity';
import { Money } from '@inventory/domain/value-objects/money.vo';
import { Quantity } from '@inventory/domain/value-objects/quantity.vo';
import { MedidaProducto } from '@inventory/domain/models/measure.model';


/**
 * @deprecated no usar
 */
export class InventoryAdjustment {
  private _details: InventoryAdjustmentDetail[] = [];

  private constructor(
    private _id: number,
    private readonly _emissionPointId: number,
    private readonly _documentTypeId: number,
    private readonly _transactionTypeId: number,
    private _emissionDate: Date,
    private _observations: string | undefined,
    private _total: Money,
    private readonly _registrationDate: Date,
  ) {}

  static create(params: {
    emissionPointId: number;
    documentTypeId: number;
    transactionTypeId: number;
    emissionDate: Date;
    observations?: string;
  }): InventoryAdjustment {
    return new InventoryAdjustment(
      0,
      params.emissionPointId,
      params.documentTypeId,
      params.transactionTypeId,
      params.emissionDate,
      params.observations,
      Money.zero(),
      new Date(),
    );
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get emissionPointId(): number {
    return this._emissionPointId;
  }
  get documentTypeId(): number {
    return this._documentTypeId;
  }
  get transactionTypeId(): number {
    return this._transactionTypeId;
  }
  get emissionDate(): Date {
    return this._emissionDate;
  }
  get observations(): string | undefined {
    return this._observations;
  }
  get total(): Money {
    return this._total;
  }
  get registrationDate(): Date {
    return this._registrationDate;
  }
  get details(): InventoryAdjustmentDetail[] {
    return [...this._details];
  }

  addDetail(params: {
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
    status: boolean;
  }) {
    const detail = InventoryAdjustmentDetail.create({
      ...params,
      orderIndex: this._details.length + 1,
    });
    detail.calculateTotal();
    console.log(detail);
    this._details.push(detail);
    this.recalculateTotal();
  }

  getDetailIndex(productId: number) {
    return this.toPlainObject().details.findIndex((detail) => detail.productId === productId);
  }

  getDetail(index: number): InventoryAdjustmentDetail {
    this.validateDetailIndex(index);
    return this._details[index];
  }

  private executeDetailUpdate(
    detailIndex: number,
    updateFn: (detail: InventoryAdjustmentDetail) => void,
    shouldRecalculateTotal = true,
  ): InventoryAdjustmentDetail {
    this.validateDetailIndex(detailIndex);

    const existingDetail = this._details[detailIndex];
    updateFn(existingDetail);

    if (shouldRecalculateTotal) {
      this.recalculateTotal();
    }

    return existingDetail;
  }

  updateDetail(detailIndex: number, additionalQuantity = 1) {
    return this.executeDetailUpdate(detailIndex, (detail) => {
      const newQuantity = detail.quantity.add(Quantity.from(additionalQuantity));
      detail.updateQuantity(newQuantity.value);
    });
  }

  updateQuantityDetail(detailIndex: number, newQuantity: number) {
    return this.executeDetailUpdate(detailIndex, (detail) => {
      detail.updateQuantity(newQuantity);
    });
  }

  updateMeasure(detailIndex: number, unitOfMeasureId: number) {
    return this.executeDetailUpdate(detailIndex, (detail) => {
      detail.updateMeasure(unitOfMeasureId);
    });
  }

  updatePricing(detailIndex: number, unitPrice: number) {
    return this.executeDetailUpdate(detailIndex, (detail) => {
      detail.updatePricing(unitPrice, detail.costPrice.value);
    });
  }

  updateWarehouseId(detailIndex: number, warehouseId: number) {
    return this.executeDetailUpdate(
      detailIndex,
      (detail) => {
        detail.updateWarehouseId(warehouseId);
      },
      false,
    );
  }

  removeDetail(index: number): void {
    this._details.splice(index, 1);
    this.reorderDetails();
    this.recalculateTotal();
  }

  updateAllWarehouseToDetail(warehouseId: number): void {
    for (const detail of this._details) {
      detail.updateWarehouseId(warehouseId);
    }
  }

  updateEmissionDate(emissionDate: Date): void {
    this._emissionDate = emissionDate;
  }

  updateObservations(observations: string): void {
    this._observations = observations;
  }

  private validateDetailIndex(index: number): void {
    if (index < 0 || index >= this._details.length) {
      throw new ValidationException(
        'index',
        index,
        `Invalid detail index: ${index}. Must be between 0 and ${this._details.length - 1}`,
      );
    }
  }

  private recalculateTotal(): void {
    this._total = this._details.reduce((sum, detail) => sum.add(detail.total), Money.zero());
  }

  private reorderDetails(): void {
    this._details.forEach((detail, index) => detail.updateOrderIndex(index + 1));
  }

  hasDetails(): boolean {
    return this._details.length > 0;
  }

  toPlainObject() {
    return {
      id: this._id,
      emissionPointId: this.emissionPointId,
      documentTypeId: this.documentTypeId,
      transactionTypeId: this.transactionTypeId,
      emissionDate: this.emissionDate,
      observations: this.observations,
      total: this.total,
      registrationDate: this.registrationDate,
      details: [...this.details.map((item) => item.toPlainObject())],
    };
  }
}
