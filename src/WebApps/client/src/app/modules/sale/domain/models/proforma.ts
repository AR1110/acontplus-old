import { DocumentBaseModel } from '@shared/models/document-base';

export interface ProformaModel extends DocumentBaseModel {}

export interface ProformaInvoiceList {
  id: number;
  customerName: string;
  issueDate: string; // o Date si prefieres
  totalAmount: number;
  status: string;
  // ...otros campos relevantes del listado
}

export class ProformaInvoiceListResult {
  data: ProformaInvoiceList[] = [];
  totalRecords = 0;
  currentPage?: number;
  pageSize?: number;

  constructor(init?: Partial<ProformaInvoiceListResult>) {
    Object.assign(this, init);
  }
}

export interface ProformaInvoiceDetail {
  header: {
    estabName: string;
    serieComprobante: string;
    issueDate: string; // fechaEmision
    subTotalWithoutTaxes: number;
    totalDiscount: number;
    discountPercentage: number;
    tip: number;
    surcharge: number;
    transport: number;
    total: number;
    observation: string;
  };
  customer: {
    businessName: string;
    IDCard: string;
    address: string;
    email: string;
  };
  details: {
    detailId: number; // idProformaDetalle
    code: string; // codigo
    description: string;
    quantity: number;
    unitMeasure: string; // medida
    taxType: string; // tipoIva
    priceLevel: string; // pvp
    unitPrice: number;
    totalWithoutTax: number;
    note: string;
    warehouse: string; // bodega
    taxValue: number;
    discountValue: number;
    discountPercentage: number;
    ice: number;
    taxCode: string; // codigoPorcentaje
    rate: number; // tarifa
  }[];
  taxes: {
    taxTypeId: number;
    taxId: number;
    description: string;
    rate: number; // porcentaje
    taxCode: string; // codigoPorcentaje
  }[];
  additionalsInfo: any[];
}
