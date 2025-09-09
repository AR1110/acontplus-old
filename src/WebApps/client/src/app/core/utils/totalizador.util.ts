import { DECIMALS } from '@core/constants/global.constants';
import { roundNumber } from './round-number.utils';
import { pricingCalculateUtil } from './pricing-calculate.util';
import DecimalUtils, { plus } from './decimal.util';



export class TotalizadorUtil {
  public  htmlTotales = '';

  private totalizadores = {
    totalPrecioTotalSinImpuesto: 0,
    totalIce: 0,
    totalDescuento: 0,
    totalSinImpuesto: 0,
    sumTotalIva: 0,
    totalPorcentajeDescuento: 0,
  };

  constructor(){
    this.htmlTotales = ''
    this.totalizadores = {
      totalPrecioTotalSinImpuesto: 0,
      totalIce: 0,
      totalDescuento: 0,
      totalSinImpuesto: 0,
      sumTotalIva: 0,
      totalPorcentajeDescuento: 0,
    };
  }

  private   calcularTotalesGenerales(items:any[]) {
    return items.reduce((acc, item) => {
      const totalSinImpuesto = pricingCalculateUtil.calcularTotalAntesDescuento(item.precioUnitario, item.cantidad);
      const totalIce = item.cantidad * item.ice;

      acc.totalIce += totalIce;
      acc.totalPrecioTotalSinImpuesto = plus(acc.totalPrecioTotalSinImpuesto, roundNumber(item.precioTotalSinImpuesto, DECIMALS.DOS), DECIMALS.GENERAL);
      acc.totalDescuento = plus(acc.totalDescuento, item.valorDescuento, DECIMALS.GENERAL);
      acc.totalSinImpuesto = plus(acc.totalSinImpuesto, roundNumber(totalSinImpuesto, DECIMALS.DOS), DECIMALS.GENERAL);

      return acc;
    }, { ...this.totalizadores });
  }

  private   calcularTotalesPorTarifa(items:any[], codigoPorcentaje:string) {
    const itemsFiltrados = items.filter(item => item.codigoPorcentaje === codigoPorcentaje);
    return itemsFiltrados.reduce((acc, item) => {
      acc.totalNetoIva = plus(acc.totalNetoIva, roundNumber(item.precioTotalSinImpuesto, DECIMALS.DOS), DECIMALS.GENERAL);
      return acc;
    }, { totalNetoIva: 0 });
  }

  private   calcularTotalIvaPorTarifa(items:any[], codigoPorcentaje:string, tarifa:number) {
    const itemsFiltrados = items.filter(item => item.codigoPorcentaje === codigoPorcentaje);
    return itemsFiltrados.reduce((acc, item) => {
      const totalIva = item.valorImpuesto || pricingCalculateUtil.calculateTaxValue(item.precioTotalSinImpuesto, tarifa);
      acc.totalIva = plus(acc.totalIva, roundNumber(totalIva, DECIMALS.DOS), DECIMALS.DOS);
      return acc;
    }, { totalIva: 0 });
  }

  private   construirHtmlTotales(totales:any) {
    return {
      htmlSubtotalImpuesto: `
            <tr>
                <td class="left">
                    <span class="fw-semibold">Subtotal sin Impuestos</span>
                </td>
                <td class="right">
                    $${roundNumber(totales.totalPrecioTotalSinImpuesto, DECIMALS.DOS)}
                </td>
            </tr>`,
      htmlTotal: `
            <tr>
                <td class="left">
                    <strong class="font-weight-bold">Valor Total</strong>
                </td>
                <td class="right font-weight-bold">
                    $${roundNumber(totales.importeTotal, DECIMALS.DOS)}
                </td>
            </tr>`
    };
  }

  public calcular(obj:any) {
    const items = obj.items as any[];
    const tarifasImpuesto = obj.tarifasImpuesto as any[]
    const totalesGenerales = this.calcularTotalesGenerales(items);
    let htmlImpuestoTotal = '';
    let htmlIvaTotal = '';

    // Procesar cada tarifa de impuesto
    tarifasImpuesto.forEach(tarifa => {
      const dataTotalNetoIva = this.calcularTotalesPorTarifa(items, tarifa.codigoPorcentaje);

      if (dataTotalNetoIva.totalNetoIva > 0) {
        htmlImpuestoTotal += `
                <tr>
                    <td class="left">
                        <span class="fw-semibold">Subtotal ${tarifa.descripcion}</span>
                    </td>
                    <td class="right">
                        $${roundNumber(dataTotalNetoIva.totalNetoIva, DECIMALS.DOS)}
                    </td>
                </tr>`;
      }

        if (tarifa.tarifa > 0) {
            const valorImpuesto = pricingCalculateUtil.calculateTaxValue(dataTotalNetoIva.totalNetoIva, tarifa.tarifa);
            this.totalizadores.sumTotalIva = plus(this.totalizadores.sumTotalIva, valorImpuesto, DECIMALS.DOS);

        if (valorImpuesto > 0) {
          htmlIvaTotal += `
                    <tr>
                        <td class="left">
                            <span class="fw-semibold">${tarifa.descripcion}</span>
                        </td>
                        <td class="right">$${roundNumber(valorImpuesto, DECIMALS.DOS)}</td>
                    </tr>`;
        }
      }
    });

    // Calcular el importe total
    const importeTotal = totalesGenerales.totalPrecioTotalSinImpuesto + this.totalizadores.sumTotalIva;

    // Calcular el porcentaje de descuento si hay descuentos
    if (totalesGenerales.totalDescuento > 0) {
      this.totalizadores.totalPorcentajeDescuento = pricingCalculateUtil.getValueDiscountPercentage(totalesGenerales.totalSinImpuesto, totalesGenerales.totalDescuento);
    }

    // Construir HTML de totales finales
    const { htmlSubtotalImpuesto, htmlTotal } = this.construirHtmlTotales({ ...totalesGenerales, importeTotal });

    // Devolver resultados finales
    const resulData = {
      subTotalSinImpuestos: roundNumber(totalesGenerales.totalPrecioTotalSinImpuesto, DECIMALS.DOS),
      totalIce: totalesGenerales.totalIce,
      irbpnr: 0,
      propina: 0,
      totalDescuento: roundNumber(totalesGenerales.totalDescuento, DECIMALS.DOS),
      porcentajeDescuento: roundNumber(this.totalizadores.totalPorcentajeDescuento, 1),
      htmlSubtotalImpuesto,
      htmlImpuestoTotal,
      htmlIvaTotal,
      htmlTotal,
      importeTotal: roundNumber(importeTotal, DECIMALS.DOS)
    };
    this.generarHtmlTotales(resulData);
    return resulData;
  }

  private   generarHtmlTotales(obj: any) {
    const { htmlSubtotalImpuesto, htmlImpuestoTotal, totalDescuento, totalIce, irbpnr, htmlIvaTotal, htmlTotal } = obj;

    this.htmlTotales = `<div class="table-responsive">
                            <table class="table table-clear table-sm small">
                                <tbody>
                                    ${htmlSubtotalImpuesto}
                                    ${htmlImpuestoTotal}
                                    <tr>
                                        <td class="left">
                                            <span class="fw-semibold">Total descuento</span>
                                        </td>
                                        <td class="right">$${totalDescuento}</td>
                                    </tr>
                                    <tr>
                                        <td class="left">
                                            <span class="fw-semibold">Valor ICE</span>
                                        </td>
                                        <td class="right">$${totalIce}</td>
                                    </tr>
                                    <tr>
                                        <td class="left">
                                            <span class="fw-semibold">Valor irbpnr</span>
                                        </td>
                                        <td class="right">$${irbpnr}</td>
                                    </tr>
                                    ${htmlIvaTotal}
                                    ${htmlTotal}
                                </tbody>
                            </table>
                        </div>`;
  }
}
