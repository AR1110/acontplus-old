import { DocumentDetail, DocumentDetailModel } from '@shared/models/document-detail';

export interface DocumentBaseModel {
  id?: string;
  documentNumber?: string;
  date: Date;
  customerId: number;
  customerName: string;
  details: DocumentDetailModel[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  total: number;
  notes?: string;
}

export abstract class DocumentBase implements DocumentBaseModel {
  id?: string;
  documentNumber?: string;
  date: Date = new Date();
  customerId = 0;
  customerName = '';
  details: DocumentDetail[] = [];
  subtotal = 0;
  totalDiscount = 0;
  totalTax = 0;
  total = 0;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<DocumentBaseModel>) {
    Object.assign(this, data);
    if (data?.details) {
      this.details = data.details.map((d) => new DocumentDetail(d));
    }
  }

  addDetail(detail?: Partial<DocumentDetailModel>): DocumentDetail {
    const newDetail = DocumentDetail.create();
    if (detail) {
      Object.assign(newDetail, detail);
    }
    this.details.push(newDetail);
    return newDetail;
  }

  removeDetail(index: number): void {
    this.details.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals(): this {
    // Recalcular cada detalle
    this.details.forEach((detail) => detail.calculate());

    // Calcular totales del documento
    // this.subtotal = this.details.reduce((sum, d) => sum + d.subtotal, 0);
    // this.totalDiscount = this.details.reduce((sum, d) => sum + d.discount, 0);
    // this.totalTax = this.details.reduce((sum, d) => sum + d.taxValue, 0);
    // this.total = this.details.reduce((sum, d) => sum + d.total, 0);

    return this;
  }
}
