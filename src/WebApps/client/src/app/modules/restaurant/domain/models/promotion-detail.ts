import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { ProductFee, ProductMeasure } from '@inventory/data/models/product-measure';

export class PromotionDetail {
  uuid = generateUuidv4();

  id = 0;
  itemId = 0;

  fees: ProductFee[] = [];
  feeId = 0;

  description = '';
  productCode = '';
  taxId = 0;

  measures: ProductMeasure[] = [];
  measureId = 0;

  // Precio COSTO (no interviene en el cálculo de venta)
  unitPrice = 0;

  // Precio venta base (antes de aplicar descuentos)
  promotionalPrice = 0;

  taxPercentage = 0;
  // Descuentos
  discountPercent = 0; // %
  discount = 0; // USD

  quantity = 1;
  subtotal = 0;

  buyQuantity = 1;
  isActive = true;
  isDeleted = false;

  constructor(init?: Partial<PromotionDetail>) {
    Object.assign(this, init);
  }

  /**
   * Calcula el precio de venta final y subtotal con:
   *  - descuento %
   *  - descuento fijo
   */
  calculate() {
    // ------------------------------------------------------------
    // 1. Validar precio de venta base
    // ------------------------------------------------------------
    if (!this.promotionalPrice || this.promotionalPrice <= 0) {
      this.subtotal = 0;
    }

    // ------------------------------------------------------------
    // 2. Calcular descuento porcentual
    // ------------------------------------------------------------
    const percentDiscountAmount = (this.promotionalPrice * this.discountPercent) / 100;

    // ------------------------------------------------------------
    // 3. Total descuentos (fijo + %)
    // ------------------------------------------------------------
    const totalDiscount = percentDiscountAmount + this.discount;

    // ------------------------------------------------------------
    // 4. Precio final (venta) después de descuentos
    // ------------------------------------------------------------
    const finalPrice = Math.max(this.promotionalPrice - totalDiscount, 0);

    // ------------------------------------------------------------
    // 5. Actualizar promotionalPrice como precio final
    //    (si quieres mantener ambos precios, dímelo y los separo)
    // ------------------------------------------------------------
    this.promotionalPrice = finalPrice;

    // ------------------------------------------------------------
    // 6. Subtotal final
    // ------------------------------------------------------------
    this.subtotal = finalPrice * this.quantity;

    return this;
  }
}
