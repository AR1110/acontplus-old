import {GroupedEstab} from "@core/models/estab.model";
import {DOC_TYPE} from "@core/constants/global.constants";

export interface InventoryAdjustmentList {
  index: number;
  "id": number
  "fechaEmision": string
  "observacion": string
  "total": number
  "nroDoc": string
  "estadoNombre": string
  "codDoc": string
  "usuarioNombre": DOC_TYPE.AC
  "style": string
  "tipoDocNombre": string
  "totalRecords": number
}


export class InventoryAdjustmentListResponse {
  data: InventoryAdjustmentList[]=[];
  totalRecords = 0;
}

export class InventoryAdjustmentFormDataResponse {
  estabs: GroupedEstab[]=[];
  subFamilias:any[]=[];
  decimal: any ={};
  tiposDoc:any[]=[];
  tiposTransaccion:any[]=[];
}

export class InventoryAdjustmentDetailResponse {
  header:any = {};
  items: any[]=[]
}

export class InventoryAdjustmentListProductsResponse {
   data: any[]=[]
}

//new formats DDD
import { BaseEntity } from '@core/domain/base-entity';
import { DomainException } from '@core/domain/domain-exception';
import {
  InventoryAdjustmentDetail
} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment-detail.entity";
import {Money} from "@inventory/inventory-adjustment/domain/value-objects/money.vo";
import {Quantity} from "@inventory/inventory-adjustment/domain/value-objects/quantity.vo";
import {InventoryDocumentType, InventoryTransactionType} from "@inventory/domain/enums/inventory.enum";
import {MedidaProducto} from "@inventory/domain/models/measure.model";
export class InventoryAdjustment {
  private _details: InventoryAdjustmentDetail[] = [];

  private constructor(
    private _id: number,
    private readonly _emissionPointId: number,
    private readonly _documentType: InventoryDocumentType,
    private readonly _transactionType: InventoryTransactionType,
    private _emissionDate: Date,
    private _observations: string | undefined,
    private _total: Money,
    private readonly _registrationDate: Date
  ) {}

  static create(params: {
    emissionPointId: number;
    documentType: InventoryDocumentType;
    transactionType: InventoryTransactionType;
    emissionDate: Date;
    observations?: string;
  }): InventoryAdjustment {
    return new InventoryAdjustment(
      0,
      params.emissionPointId,
      params.documentType,
      params.transactionType,
      params.emissionDate,
      params.observations,
      Money.zero(),
      new Date()
    );
  }

  // Getters
  get id(): number { return this._id; }
  get emissionPointId(): number { return this._emissionPointId; }
  get documentType(): InventoryDocumentType { return this._documentType; }
  get transactionType(): InventoryTransactionType { return this._transactionType; }
  get emissionDate(): Date { return this._emissionDate; }
  get observations(): string | undefined { return this._observations; }
  get total(): Money { return this._total; }
  get registrationDate(): Date { return this._registrationDate; }
  get details(): readonly InventoryAdjustmentDetail[] { return [...this._details]; }

  addDetail(params: {
    productId: number;
    code: string;
    warehouseId: number;
    unitOfMeasureId?: number;
    measures:MedidaProducto[];
    quantity: number;
    transactionQuantity: number;
    unitConversion: number
    unitPrice: number;
    costPrice: number;
    fractionalCostPrice: number;
    description: string;
    notes?: string;
  }): void {
    console.log(params)
    const detail = InventoryAdjustmentDetail.create({
      ...params,
      orderIndex: this._details.length + 1
    });
    this._details.push(detail);
    this.recalculateTotal();
  }

  updateDetail(detailIndex: number, additionalQuantity = 1){
    const existingDetail = this.details[detailIndex];

    // Update quantity using Value Object operations
    const newQuantity = existingDetail.quantity.add(Quantity.from(additionalQuantity));
    const newTransactionQuantity = existingDetail.transactionQuantity.add(Quantity.from(additionalQuantity));

    existingDetail.updateQuantity(newQuantity.value, newTransactionQuantity.value);
    this.recalculateTotal();
    return existingDetail;
  }

  removeDetail(index: number): void {
    this._details.splice(index, 1);
    this.reorderDetails();
    this.recalculateTotal();
  }

  updateObservations(observations: string): void {
    this._observations = observations;
  }

  private recalculateTotal(): void {
    this._total = this._details.reduce((sum, detail) => sum.add(detail.total), Money.zero());
  }

  private reorderDetails(): void {
    this._details.forEach((detail, index) => detail.updateOrderIndex(index + 1));
  }

  toPlainObject(){
    return {
      id: this._id,
      emissionPointId: this._emissionPointId,
      documentType: this._documentType,
      transactionType: this._transactionType,
      emissionDate: this._emissionDate,
      observations: this._observations,
      total:  this._total.value,
      registrationDate: this._registrationDate,
      details:  [...this._details.map(item => item.toPlainObject())]
    }
  }
}
