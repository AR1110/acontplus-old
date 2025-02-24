import { generateUuidv4 } from '@domain/utils/generate-uuidv4';
import { SRI_IDENTIFICATION_CODE } from '@domain/enums/main.enum';
import { Order, OrderItem } from '@domain/models/order.model';
import { Tax, TaxRate } from '@domain/models/tax.model';
import { GenericStoreSignalService } from '@domain/services/generic-store-signal.service';
import { PromotionService } from '@data/repositories/promotion/promotion.service';
import { inject, Injectable } from '@angular/core';

type PosStoreState = {
  isModulePos: boolean;
  isLoading: boolean;
  isSelectedItem: boolean;
  tarifaId: 0;
  oldTarifaId: 0;
  order: Order;
  orderItems: OrderItem[];
  vendedores: any[];
  taxes: Record<string | number, Tax>;
  taxRates: Record<string | number, TaxRate>;
  orderItem: OrderItem;
  isRefreshPromotion: boolean;
  promotionsMenu: any[];
  codeSubCategory: string;
  tarifas: any[];
};
export const orderInitialState = () => {
  let result: Order = {
    uuid: generateUuidv4(),
    orderId: 0,
    userId: 0,
    tipoIdentificacionSri: SRI_IDENTIFICATION_CODE.CONSUMIDOR_FINAL,
    customerCompanyId: 0,
    customerName: 'CONSUMIDOR FINAL',
    createdAt: new Date(),
    subtotalSinImpuestos: 0,
    items: [],
    customDetail: undefined,
    itemsToPay: undefined,
    tableId: 0,
    obs: undefined,
    tableDesc: undefined,
    establecimientoId: 0,
    puntoEmisionId: 0,
    codDoc: undefined,
    tax: 0,
    discount: 0,
    tip: 0,
    total: 0,
    quickSale: undefined,
    bodegaId: undefined,
    saveDoc: undefined,
    updateOrder: undefined,
  };
  return result;
};

export const posStoreStateInitial = (): PosStoreState => {
  return {
    isModulePos: false,
    isLoading: false,
    isSelectedItem: false,
    tarifaId: 0,
    oldTarifaId: 0,
    order: structuredClone(orderInitialState()),
    orderItems: [],
    vendedores: [],
    taxes: {},
    taxRates: {},
    orderItem: {
      uuid: '',
      itemTypeCode: '',
      itemTypeId: undefined,
      id: 0,
      menuId: 0,
      itemId: 0,
      taxId: 0,
      taxPercentId: 0,
      feeId: 0,
      taxValue: 0,
      quantity: 0,
      remainingQuantity: undefined,
      cost: 0,
      price: 0,
      discount: 0,
      total: 0,
      obs: undefined,
      bodegaId: 0,
      medidaId: 0,
      codigoTarifaImpuesto: '',
      taxPercent: 0,
      summary: undefined,
      productId: 0,
      code: '',
      precioConIva: 0,
      precioTotalSinImpuesto: 0,
      medida: '',
      descripcion: '',
      llevaInventario: false,
      img: undefined,
      medidas: [],
      pvps: [],
      consolidacionesFecha: [],
      envioSri: undefined,
      paid: undefined,
      conversion: 1,
      costoFraccionado: 0,
    },
    isRefreshPromotion: false,
    promotionsMenu: [],
    codeSubCategory: '',
    tarifas: [],
  };
};

@Injectable({
  providedIn: 'root',
})
export class PosStoreService extends GenericStoreSignalService<PosStoreState> {
  private promotionSvc = inject(PromotionService);
  constructor() {
    super();
  }

  setLoading(isLoading: boolean) {
    this.state.update((e) => ({
      ...e,
      isLoading,
    }));
  }

  public getPromotions(estabId: number) {
    let params = {
      estabId,
    };
    this.setLoading(true);
    this.state.update((e) => ({
      ...e,
      promotionsMenu: [],
    }));
    this.promotionSvc.getPromotions(params).subscribe({
      next: (response) => {
        this.setLoading(false);
        this.state.update((e) => ({
          ...e,
          promotionsMenu: response,
        }));
      },
      error: (err) => {
        this.setLoading(false);
        console.log(err);
      },
    });
  }

  addRow() {
    let data: OrderItem = {
      uuid: generateUuidv4(),
      itemTypeCode: '',
      id: 0,
      menuId: 0,
      itemId: 0,
      taxId: 0,
      taxPercentId: 0,
      feeId: 0,
      taxValue: 0,
      quantity: 0,
      cost: 0,
      price: 0,
      discount: 0,
      total: 0,
      bodegaId: 0,
      medidaId: 0,
      codigoTarifaImpuesto: '',
      taxPercent: 0,
      productId: 0,
      code: '',
      precioConIva: 0,
      precioTotalSinImpuesto: 0,
      medida: '',
      descripcion: '',
      llevaInventario: false,
      medidas: [],
      pvps: [],
      consolidacionesFecha: [],
      costoFraccionado: 0,
      conversion: 1,
    };
    return data;
  }
}
