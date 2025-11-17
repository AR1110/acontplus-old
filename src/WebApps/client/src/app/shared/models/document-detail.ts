import DecimalUtils from "@core/utils/decimal.util";
import {pricingCalculateUtil} from "@core/utils/pricing-calculate.util";
export interface DocumentDetailModel {
  quantity: number;
  price: number;
  priceWithTax: number;
  discount: number;
  percentDiscount: number;
  subtotal: number;
  taxValue: number;
  total: number;
  productId: number;
  productName: string;
  productCode: string;
}


export class DocumentDetail implements DocumentDetailModel {
  quantity = 1;
  price = 0;
  priceWithTax = 0;
  discount = 0;
  percentDiscount = 0;
  subtotal = 0;
  taxValue = 0;
  total = 0;
  productId = 0;
  productName = '';
  productCode = '';

  constructor(data?: Partial<DocumentDetailModel>) {
    Object.assign(this, data);
  }

  calculate(): this {
    const qty = (this.quantity || 0);
    const price = (this.price || 0);

    const baseAmount = DecimalUtils.multiplyAsNumber(price, qty);

    let discountAmount = 0;
    if (this.percentDiscount > 0) {
      discountAmount = pricingCalculateUtil.getValueDiscount(baseAmount, this.percentDiscount);
      this.discount = Number(discountAmount.toFixed(5));
    } else if (this.discount > 0) {
      discountAmount = this.discount;
    }

    const subtotal = pricingCalculateUtil.calcularSubtotalSinImpuesto(
      price,
      qty,
      discountAmount
    );
    this.subtotal = Number(subtotal.toFixed(5));

    const tax = pricingCalculateUtil.calculateTaxValue(
      price,
      0
    )
    this.taxValue = Number(tax.toFixed(5));

    this.total = DecimalUtils.addAsNumber(subtotal, tax);

    this.priceWithTax = pricingCalculateUtil.calculatePriceWithVat(
      price,
      12
    )

    return this;
  }

  static create(): DocumentDetail {
    return new DocumentDetail({
      quantity: 1,
      price: 0,
      percentDiscount: 0,
      discount: 0,
      subtotal: 0,
      taxValue: 0,
      total: 0,
      priceWithTax: 0,
   //   taxRate: 12,
    });
  }
}
