import { pricingCalculateUtil } from './pricing-calculate.util';
import { DECIMALS } from '@core/constants/global.constants';
import { roundNumber } from './round-number.utils';
import DecimalUtil from "@core/utils/decimal.util";

// Interfaces para tipado fuerte
interface Item {
  cantidad: number;
  quantity?: number;
  precioUnitario: number;
  unitPrice?: number;
  ice?: number;
  precioTotalSinImpuesto: number;
  totalWithoutTax?: number;
  valorDescuento: number;
  codigoPorcentaje: string;
  valorImpuesto?: number;
}

interface TarifaImpuesto {
  codigoPorcentaje: string;
  descripcion: string;
  tarifa: number;
}

interface TotalesGenerales {
  totalPrecioTotalSinImpuesto: number;
  totalIce: number;
  totalDescuento: number;
  totalSinImpuesto: number;
  totalPorcentajeDescuento: number;
}

interface TotalesPorTarifa {
  codigoPorcentaje: string;
  descripcion: string;
  totalNetoIva: number;
  totalIva: number;
}

// Nueva interfaz para representar filas de totales
interface TotalRow {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  isBold?: boolean;
  isSubtotal?: boolean;
}

interface TotalesResult {
  // Datos estructurados para tablas
  totalRows: TotalRow[];

  // Datos originales
  subTotalSinImpuestos: number;
  totalIce: number;
  irbpnr: number;
  propina: number;
  totalDescuento: number;
  porcentajeDescuento: number;
  importeTotal: number;

  // Componentes HTML
  htmlSubtotalImpuesto: string;
  htmlImpuestoTotal: string;
  htmlIvaTotal: string;
  htmlTotal: string;
  htmlCompleto: string;
}

export class TotalizadorUtil {
  public calcular(obj: { items: Item[]; tarifasImpuesto: TarifaImpuesto[] }): TotalesResult {
    // Validaciones básicas
    if (!obj.items || !Array.isArray(obj.items)) {
      throw new Error('Items debe ser un array válido');
    }
    if (!obj.tarifasImpuesto || !Array.isArray(obj.tarifasImpuesto)) {
      throw new Error('TarifasImpuesto debe ser un array válido');
    }

    // 1. Calcular totales generales
    const totalesGenerales = this.calcularTotalesGenerales(obj.items);

    // 2. Agrupar items por código de porcentaje
    const itemsPorTarifa = this.agruparItemsPorTarifa(obj.items);

    // 3. Calcular totales por tarifa
    const totalesPorTarifa = this.calcularTotalesPorTarifa(itemsPorTarifa, obj.tarifasImpuesto);

    // 4. Calcular importe total
    const importeTotal = DecimalUtil.addAsNumber(
      totalesGenerales.totalPrecioTotalSinImpuesto,
      totalesPorTarifa.sumTotalIva
    );

    // 5. Calcular porcentaje de descuento si aplica
    if (totalesGenerales.totalDescuento > 0) {
      totalesGenerales.totalPorcentajeDescuento = pricingCalculateUtil.getValueDiscountPercentage(
        totalesGenerales.totalSinImpuesto,
        totalesGenerales.totalDescuento
      );
    }

    // 6. Generar filas de totales (nuevo formato para tablas)
    const totalRows = this.generarFilasTotales({
      totalesGenerales,
      totalesPorTarifa: totalesPorTarifa.totalesPorTarifa,
      importeTotal
    });

    // 7. Generar componentes HTML
    const htmlComponents = this.generarComponentesHtml({
      totalesGenerales,
      totalesPorTarifa: totalesPorTarifa.totalesPorTarifa,
      importeTotal
    });

    // 8. Generar HTML completo
    const htmlCompleto = this.generarHtmlCompleto(htmlComponents);

    // 9. Retornar resultado con ambos formatos
    return {
      totalRows,
      subTotalSinImpuestos: roundNumber(totalesGenerales.totalPrecioTotalSinImpuesto, DECIMALS.DOS),
      totalIce: totalesGenerales.totalIce,
      irbpnr: 0,
      propina: 0,
      totalDescuento: roundNumber(totalesGenerales.totalDescuento, DECIMALS.DOS),
      porcentajeDescuento: roundNumber(totalesGenerales.totalPorcentajeDescuento, 1),
      importeTotal: roundNumber(importeTotal, DECIMALS.DOS),
      ...htmlComponents,
      htmlCompleto
    };
  }

  private calcularTotalesGenerales(items: Item[]): TotalesGenerales {
    return items.reduce((acc, item) => {
      const quantity = item.cantidad || item.quantity || 0;
      const unitPrice = item.precioUnitario || item.unitPrice || 0;
      const totalSinImpuesto = pricingCalculateUtil.calcularTotalAntesDescuento(unitPrice, quantity);
      const totalIce = quantity * (item.ice ?? 0);

      return {
        ...acc,
        totalIce: DecimalUtil.addAsNumber(acc.totalIce, totalIce),
        totalPrecioTotalSinImpuesto: DecimalUtil.addAsNumber(
          acc.totalPrecioTotalSinImpuesto,
          roundNumber(item.precioTotalSinImpuesto ?? item.totalWithoutTax ?? 0, DECIMALS.DOS),
        ),
        totalDescuento: DecimalUtil.addAsNumber(acc.totalDescuento, item.valorDescuento),
        totalSinImpuesto: DecimalUtil.addAsNumber(
          acc.totalSinImpuesto,
          roundNumber(totalSinImpuesto, DECIMALS.DOS)
        ),
      };
    }, {
      totalPrecioTotalSinImpuesto: 0,
      totalIce: 0,
      totalDescuento: 0,
      totalSinImpuesto: 0,
      totalPorcentajeDescuento: 0
    });
  }

  private agruparItemsPorTarifa(items: Item[]): Record<string, Item[]> {
    return items.reduce((acc, item) => {
      const key = item.codigoPorcentaje;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
  }

  private calcularTotalesPorTarifa(
    itemsPorTarifa: Record<string, Item[]>,
    tarifasImpuesto: TarifaImpuesto[]
  ): { totalesPorTarifa: TotalesPorTarifa[]; sumTotalIva: number } {
    const totalesPorTarifa: TotalesPorTarifa[] = [];
    let sumTotalIva = 0;

    tarifasImpuesto.forEach(tarifa => {
      const items = itemsPorTarifa[tarifa.codigoPorcentaje] || [];

      // Calcular total neto IVA
      const totalNetoIva = items.reduce((acc, item) => {
        return DecimalUtil.addAsNumber(
          acc,
          roundNumber(item.precioTotalSinImpuesto, DECIMALS.DOS)
        );
      }, 0);

      // Calcular total IVA
      let totalIva = 0;
      if (tarifa.tarifa > 0) {
        totalIva = items.reduce((acc, item) => {
          const valorImpuesto =
            item.valorImpuesto ??
            pricingCalculateUtil.calculateTaxValue(item.precioTotalSinImpuesto, tarifa.tarifa);
          return DecimalUtil.addAsNumber(acc, roundNumber(valorImpuesto, DECIMALS.DOS), DECIMALS.DOS);
        }, 0);
        sumTotalIva = DecimalUtil.addAsNumber(sumTotalIva, totalIva, DECIMALS.DOS);
      }

      if (totalNetoIva > 0 || totalIva > 0) {
        totalesPorTarifa.push({
          codigoPorcentaje: tarifa.codigoPorcentaje,
          descripcion: tarifa.descripcion,
          totalNetoIva,
          totalIva
        });
      }
    });

    return { totalesPorTarifa, sumTotalIva };
  }

  private generarFilasTotales(data: {
    totalesGenerales: TotalesGenerales;
    totalesPorTarifa: TotalesPorTarifa[];
    importeTotal: number;
  }): TotalRow[] {
    const { totalesGenerales, totalesPorTarifa, importeTotal } = data;
    const rows: TotalRow[] = [];

    // Subtotal sin impuestos
    rows.push({
      key: 'subtotal_sin_impuestos',
      label: 'Subtotal sin Impuestos',
      value: totalesGenerales.totalPrecioTotalSinImpuesto,
      formattedValue: `$${roundNumber(totalesGenerales.totalPrecioTotalSinImpuesto, DECIMALS.DOS)}`,
      isSubtotal: true
    });

    // Subtotales por tarifa
    totalesPorTarifa.forEach(tarifa => {
      if (tarifa.totalNetoIva > 0) {
        rows.push({
          key: `subtotal_${tarifa.codigoPorcentaje}`,
          label: `Subtotal ${tarifa.descripcion}`,
          value: tarifa.totalNetoIva,
          formattedValue: `$${roundNumber(tarifa.totalNetoIva, DECIMALS.DOS)}`,
          isSubtotal: true
        });
      }
    });

        acc.totalIce += totalIce;
        acc.totalPrecioTotalSinImpuesto = plus(
          acc.totalPrecioTotalSinImpuesto,
          roundNumber((item.precioTotalSinImpuesto ?? item.totalWithoutTax), DECIMALS.DOS),
          DECIMALS.GENERAL,
        );
        acc.totalDescuento = plus(acc.totalDescuento, item.valorDescuento, DECIMALS.GENERAL);
        acc.totalSinImpuesto = plus(
          acc.totalSinImpuesto,
          roundNumber(totalSinImpuesto, DECIMALS.DOS),
          DECIMALS.GENERAL,
        );

    // ICE
    if (totalesGenerales.totalIce > 0) {
      rows.push({
        key: 'valor_ice',
        label: 'Valor ICE',
        value: totalesGenerales.totalIce,
        formattedValue: `$${roundNumber(totalesGenerales.totalIce, DECIMALS.DOS)}`
      });
    }

  private calcularTotalesPorTarifa(items: any[], codigoPorcentaje: string) {
    const itemsFiltrados = items.filter(item => item.codigoPorcentaje === codigoPorcentaje);
    return itemsFiltrados.reduce(
      (acc, item) => {
        acc.totalNetoIva = plus(
          acc.totalNetoIva,
          roundNumber(item.precioTotalSinImpuesto, DECIMALS.DOS),
          DECIMALS.GENERAL,
        );
        return acc;
      },
      { totalNetoIva: 0 },
    );
  }

  private calcularTotalIvaPorTarifa(items: any[], codigoPorcentaje: string, tarifa: number) {
    const itemsFiltrados = items.filter(item => item.codigoPorcentaje === codigoPorcentaje);
    return itemsFiltrados.reduce(
      (acc, item) => {
        const totalIva =
          item.valorImpuesto ||
          pricingCalculateUtil.calculateTaxValue(item.precioTotalSinImpuesto, tarifa);
        acc.totalIva = plus(acc.totalIva, roundNumber(totalIva, DECIMALS.DOS), DECIMALS.DOS);
        return acc;
      },
      { totalIva: 0 },
    );
  }

  private generarComponentesHtml(data: {
    totalesGenerales: TotalesGenerales;
    totalesPorTarifa: TotalesPorTarifa[];
    importeTotal: number;
  }) {
    const { totalesGenerales, totalesPorTarifa, importeTotal } = data;

    // HTML subtotal sin impuestos
    const htmlSubtotalImpuesto = `
      <tr>
        <td class="left">
          <span class="fw-semibold">Subtotal sin Impuestos</span>
        </td>
        <td class="right">
          $${roundNumber(totalesGenerales.totalPrecioTotalSinImpuesto, DECIMALS.DOS)}
        </td>
      </tr>`;

    // HTML por tarifas
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
              $${roundNumber(tarifa.totalNetoIva, DECIMALS.DOS)}
            </td>
          </tr>`;
      }

      if (tarifa.totalIva > 0) {
        htmlIvaTotal += `
          <tr>
            <td class="left">
              <span class="fw-semibold">IVA ${tarifa.descripcion}</span>
            </td>
            <td class="right">$${roundNumber(tarifa.totalIva, DECIMALS.DOS)}</td>
          </tr>`;
      }
    });

    // HTML total
    const htmlTotal = `
      <tr>
        <td class="left">
          <strong class="font-weight-bold">Valor Total</strong>
        </td>
        <td class="right font-weight-bold">
          $${roundNumber(importeTotal, DECIMALS.DOS)}
        </td>
      </tr>`;

    return {
      htmlSubtotalImpuesto,
      htmlImpuestoTotal,
      htmlIvaTotal,
      htmlTotal
    };
  }

  private generarHtmlCompleto(components: {
    htmlSubtotalImpuesto: string;
    htmlImpuestoTotal: string;
    htmlIvaTotal: string;
    htmlTotal: string;
  }): string {
    const { htmlSubtotalImpuesto, htmlImpuestoTotal, htmlIvaTotal, htmlTotal } = components;

    return `<div class="table-responsive">
      <table class="table table-clear table-sm small">
        <tbody>
          ${htmlSubtotalImpuesto}
          ${htmlImpuestoTotal}
          <tr>
            <td class="left">
              <span class="fw-semibold">Total descuento</span>
            </td>
            <td class="right">$${roundNumber(0, DECIMALS.DOS)}</td>
          </tr>
          <tr>
            <td class="left">
              <span class="fw-semibold">Valor ICE</span>
            </td>
            <td class="right">$${roundNumber(0, DECIMALS.DOS)}</td>
          </tr>
          <tr>
            <td class="left">
              <span class="fw-semibold">Valor irbpnr</span>
            </td>
            <td class="right">$${roundNumber(0, DECIMALS.DOS)}</td>
          </tr>
          ${htmlIvaTotal}
          ${htmlTotal}
        </tbody>
      </table>
    </div>`;
  }
}
