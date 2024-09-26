import { DECIMALS } from "@core/constants/global.constants";
import { div, minus, mul, plus } from "./decimal.util";

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




  //calculos con lib decimal js
  /**
   *
   * @param price
   * @param percentage
   * @returns taxValue number
   */
  calculateTaxValue(price: number, percentage: number) {
    try {
      let multiplo = mul(price, percentage, DECIMALS.CINCO) as number;
      const tax = div(multiplo, 100, DECIMALS.CINCO) as number;
      return tax;
    } catch (error) {
      throw new Error('pricingUtils -> CALCULO PRECIO CON IVA' + error)
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
      const cociente = div(percentage, 100, DECIMALS.CINCO) as number;
      const result = mul(salePrice, cociente, DECIMALS.CINCO) as number;
      return result + salePrice;
    } catch (error) {
      throw new Error('pricingUtils -> CALCULO PRECIO CON IVA' + error)
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
      let cociente = div(percentage, 100, DECIMALS.CINCO) as number;
      const resultPercentage = cociente + 1;
      return div(priceWithVat, resultPercentage, 5) as number;
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
  getDiscountedVatPrice: function (priceWithVAT: number, discountPercentage: number): number {
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
  },

  // Función para calcular el total antes de aplicar descuentos
  calcularTotalAntesDescuento: function (precioUnitario: number, cantidad: number) {
    let valorTotal = mul(precioUnitario, cantidad, DECIMALS.CINCO);
    return valorTotal as number;
  },

  calcularSubtotalSinImpuesto: function (precioUnitario: number, cantidad: number, descuento: number) {
    let totalAntesDescuento = this.calcularTotalAntesDescuento(precioUnitario, cantidad);
    let subtotalSinImpuesto = minus(totalAntesDescuento, descuento, DECIMALS.CINCO);
    return subtotalSinImpuesto as number;
  },

  // Calcular el total con impuesto
  calcularTotalConImpuesto: function (subtotalSinImpuesto: number, valorImpuesto: number) {

    // Sumar el subtotal sin impuestos y el valor del impuesto
    let totalConImpuesto = plus(subtotalSinImpuesto, valorImpuesto, DECIMALS.CINCO);
    return totalConImpuesto as number;

  }



}




