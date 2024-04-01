export const pricingCalculateUtil = {


  calculateVATAmount(price: number, percentage: number) {
    return (percentage / 100) * price;
  },

  addVATToPrice(price: number, vatAmount: number) {
    return price + vatAmount;
  },
  /**
 * Calcula el precio incluyendo un porcentaje dado al precio de venta.
 * @param salePrice El precio original.
 * @param percentage El porcentaje a agregar al precio de venta.
 * @returns El precio de venta calculado incluyendo el porcentaje.
 */
  calculatePriceIncludePercentage(price: number, percentage: number): number {
    try {
      const vatAmount = this.calculateVATAmount(price, percentage);
      return this.addVATToPrice(price, vatAmount);
    } catch (error) {
      console.error('pricingUtils -> CALCULO PRECIO CON IVA', error);
      return -1;
    }
  },


  /**
   *
   * @param price
   * @param percentage
   * @returns taxValue number
   */
  calculateTaxValue(price: number, percentage: number) {
    try {
      const tax = (price * percentage) / 100;
      return tax;
    } catch (error) {
      console.log('pricingUtils -> CALCULO PRECIO CON IVA', error);
      return -1;
    }
  },

  /**
   *
   * @param salePrice
   * @param percentage
   * @returns number
   */
  calculatePriceWithVat: function (salePrice: number, percentage: number): number {
    try {
      const resultPercentage = percentage / 100;
      const result = salePrice * resultPercentage;
      return result + salePrice;
    } catch (error) {
      console.log('pricingUtils -> CALCULO PRECIO CON IVA', error);
      return -1;
    }
  },


  /**
   *
   * @param priceWithVat
   * @param percentage
   * @returns number;
   */
  calculatePriceSale: function (priceWithVat: number, percentage: number): number {
    try {
      const resultPercentage = percentage / 100 + 1;
      return priceWithVat / resultPercentage;
    } catch (error) {
      console.log('pricingUtils -> CALCULO PRECIO Unitario', error);
      return -1;
    }
  },


  /**
   *
   * @param unitPrice precio unitario o precio costo
   * @param percentageUtility porcentaje utilidad
   * @returns
   */
  calculatePriceSaleOfValuePercentageUtility: function (unitPrice: number, percentageUtility: number): number {
    try {
      const resultDivisorPercentage = percentageUtility / 100;
      const multiplicationResult = unitPrice * resultDivisorPercentage;
      return unitPrice + multiplicationResult;
    } catch (error) {
      console.log('pricingUtils -> calcularPorcentajeUtilidad', error);
      return -1;
    }
  },


  /**
   *
   * @param priceSale precio de venta
   * @param unitPrice precio unitario o precio costo
   * @returns
   */
  getValuePercentageUtility: function (priceSale: number, unitPrice: number): number {
    try {
      return (Number(priceSale) / Number(unitPrice) * 100) - 100;
    } catch (error) {
      console.log('pricingUtils -> campoPorcentajeUtilidad', error);
      return -1;
    }
  },

  /**
   * Función que se emplea en documentos de venta
   * @param priceWithVAT
   * @param discountPercentage
   * @returns
   */
  getDiscountedVATPrice: function (priceWithVAT: number, discountPercentage: number): number {
    try {
      const resultPercentage = Number(discountPercentage) / 100;
      const discount = Number(resultPercentage) * Number(priceWithVAT);
      return Number(priceWithVAT) - Number(discount);
    } catch (error) {
      console.log('pricingUtils -> getPrecioIvaConDescuento', error);
      return -1;
    }

  },


  /**
   *
   * @param unitPrice
   * @param discountPercentage
   * @returns
   */
  getValueDiscount: function (unitPrice: number, discountPercentage: number): number {
    try {
      const percentage = Number(discountPercentage) / 100;
      return Number(percentage) * Number(unitPrice);
    } catch (error) {
      console.log('pricingUtils -> getValorDescuento', error);
      return -1;
    }
  },

  /**
   *
   * @param unitPrice
   * @param valueDiscount
   * @returns
   */
  getValueDiscountPercentage: function (unitPrice: number, valueDiscount: number): number {
    try {
      const percentage = valueDiscount / unitPrice;
      return percentage * 100;
    } catch (error) {
      console.log('pricingUtils -> getPorcentajeDescuento', error);
      return -1;
    }
  },

  getValueUtility: (priceSale: number, unitPrice: number): number => {
    return (priceSale - unitPrice);
  }


}

