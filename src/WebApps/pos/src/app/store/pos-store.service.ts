import { generateUuidv4 } from "@/core/utils/generate-uuidv4";
import { SRI_IDENTIFICATION_CODE } from "@/enums/main.enum";
import { Order, OrderItem } from "@/models/order.model";
import { Tax, TaxRate } from "@/models/tax.model";
import { GenericStoreSignalService } from "@/services/generic-store-signal.service";
import { Injectable } from "@angular/core";

type PosStoreState = {
  isLoading: boolean
  isSelectedItem: boolean
  order: Order
  orderItems: OrderItem[]
  vendedores: any[];
  taxes: Record<string | number, Tax>
  taxRates: Record<string | number, TaxRate>
  orderItem: OrderItem
}
export const orderInitialState = () => {

  let result: Order = {
    uuid: generateUuidv4(),
    orderId: 0,
    userId: 0,
    tipoIdentificacionSri: SRI_IDENTIFICATION_CODE.CONSUMIDOR_FINAL,
    customerCompanyId: 0,
    customerName: "CONSUMIDOR FINAL",
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
    updateOrder: undefined
  }
  return result;
}

export const posStoreStateInitial = (): PosStoreState => {
  return {
    isLoading: false,
    isSelectedItem: false,
    order: structuredClone(orderInitialState()),
    orderItems: [],
    vendedores: [],
    taxes: {},
    taxRates: {},
    orderItem: {
      uuid: "",
      itemTypeCode: "",
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
      codigoTarifaImpuesto: "",
      taxPercent: 0,
      summary: undefined,
      productId: 0,
      code: "",
      precioConIva: 0,
      precioTotalSinImpuesto: 0,
      medida: "",
      descripcion: "",
      llevaInventario: false,
      img: undefined,
      medidas: [],
      pvps: [],
      consolidacionesFecha: [],
      envioSri: undefined,
      paid: undefined,
      conversion: 1,
      costoFraccionado: 0
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PosStoreService extends GenericStoreSignalService<PosStoreState> {
  constructor() {
    super();
  }




}
