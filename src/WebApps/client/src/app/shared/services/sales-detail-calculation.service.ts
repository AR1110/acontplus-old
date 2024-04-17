import { inject, Injectable } from "@angular/core";
import { ToasterService } from "@core/services/toaster.service";
import { pricingCalculateUtil } from "@core/utils/pricing-calculate.util";
import { roundNumber } from "@core/utils/round-number.utils";
import { MedidaProducto } from "@modules/inventory/shared/models/measure.model";
import { TarifaProducto } from "@modules/inventory/shared/models/tarifa.model";
import { TarifaImpuesto } from "@shared/models/tarifa-impuesto.model";

type Data = {
  quantity: number;
  price: number;
  medidaId: number
  medidas: MedidaProducto[]
  tarifas: TarifaProducto[]
  feeId: number
  precioConIva: number
  percentageDiscount: number
  discount: number
  precioTotalSinImpuesto: number
  taxValue: number
  total: number
  conversion: number
  cost: number
  costoFraccionado: number
  taxPercentId: number
  taxId: number
}

type CalculateColDefProps = {
  data: Data; // Use the Data type directly
  column: any;
  oldValue: string | number; // Remove the duplicate property
  feeId: number
  decimal: any
  columnDefs: any
}

type TaxTotalProps = {
  items: Data[]
  decimal: any
  tarifasImpuesto: TarifaImpuesto[]
}

@Injectable({
  providedIn: 'root'
})
export class SalesDetailCalculationService {

  tS = inject(ToasterService)

  calculateColDef(props: CalculateColDefProps) {
    const self = this;
    const { data, column, oldValue, feeId: generalFeeId, decimal, columnDefs } = props;

    let dataTarifaImpuesto: TarifaImpuesto = columnDefs.find((item: any) => item.field === 'taxPercentId').editorParams()
      .find((item: any) => item.idTarifaImpuesto === Number(data.taxPercentId));

    let quantity = Number(data.quantity);
    let feeId = Number(data.feeId);
    let price = Number(data.price)
    let precioConIva = Number(data.precioConIva)
    let percentageDiscount = Number(data.percentageDiscount)
    let discount = Number(data.discount)



    const calculoColumnas: any = {
      'quantity': function () {

        if (data.quantity === oldValue) return


        data.quantity = roundNumber(quantity, decimal.nroCantidad);
        calculoColumnas["percentageDiscount"]();

      },
      'medidaId': function () {
        if (data.medidaId === oldValue) return

        let dataMedida = data.medidas.find(val => val.idMedida === data.medidaId);
        let tarifas: TarifaProducto[] = [];
        if (dataMedida) {
          if (dataMedida && typeof dataMedida.tarifas === 'string') {
            tarifas = JSON.parse(dataMedida.tarifas);
          } else {
            tarifas = dataMedida.tarifas;
          }
        }
        let dataTarifa = tarifas.find((item: any) => item.idTarifa === feeId);

        if (dataTarifa) {

          data.tarifas = tarifas;
          data.feeId = feeId
          data.price = roundNumber(dataTarifa.precioVenta, decimal.nroPrecio);
          data.precioConIva = roundNumber(dataTarifa.precioConIva, decimal.nroPrecio);
          data.percentageDiscount = 0;
          data.discount = 0;
          data.conversion = dataMedida?.conversion ?? 0;
          data.conversion = dataMedida?.precioCosto ?? 0;
          data.costoFraccionado = dataMedida?.precioCostoFraccionado ?? 0;
        }

      },
      'taxId': function(){

      },

      'taxPercentId': function () {
        try {

          if (data.taxPercentId === oldValue) return
          data.taxId = dataTarifaImpuesto.idImpuesto;
          calculoColumnas["price"]();
        } catch (error) {
          self.tS.toastr({
            type: 'error',
            message: `CALCULO TIPO IVA: ${error}`
          })
        }
      },

      'feeId': function () {
        try {
          if (feeId === oldValue) return
          let dataTarifa = data.tarifas.find(item => item.idTarifa === feeId);

          if (!dataTarifa) {
            data.feeId = Number(oldValue);
            return
          }

          let precioConIva = pricingCalculateUtil.calculatePriceWithVat(dataTarifa.precioVenta, dataTarifaImpuesto.porcentaje);
          let precioConIvaConDesuento = pricingCalculateUtil.getDiscountedVATPrice(precioConIva, data.percentageDiscount);
          let valorDescuento = pricingCalculateUtil.getValueDiscount(dataTarifa.precioVenta, data.percentageDiscount);
          console.log(dataTarifa)
          console.log(precioConIvaConDesuento)
          console.log(valorDescuento)
          data.price = roundNumber(dataTarifa.precioVenta, decimal.nroPrecio);
          data.precioConIva = roundNumber(precioConIvaConDesuento, decimal.nroPrecio);
          data.discount = roundNumber(valorDescuento, decimal.nroDescuentoDetalle);

        } catch (error) {
          self.tS.toastr({
            type: 'error',
            message: `CAMBIO DE TARIFA: ${error}`
          })
        }
      },

      'price': function () {
        try {

          if (price === oldValue) return;

          let precioConIva = pricingCalculateUtil.calculatePriceWithVat(price, dataTarifaImpuesto.porcentaje);
          let valorDescuento = pricingCalculateUtil.getValueDiscount(price, data.percentageDiscount);

          data.price = roundNumber(price, decimal.nroPrecio);
          data.precioConIva = roundNumber(precioConIva, decimal.nroPrecio);
          data.discount = roundNumber(valorDescuento, decimal.nroDescuentoDetalle);

        } catch (error) {
          self.tS.toastr({
            type: 'error',
            message: `CÁLCULO DE PRECIO UNITARIO: ${error}`
          })
        }
      },

      'precioConIva': function () {
        try {

          if (precioConIva === oldValue) return;

          let precioUnitario = pricingCalculateUtil.calculatePriceSale(precioConIva, dataTarifaImpuesto.porcentaje);

          data.precioConIva = roundNumber(precioConIva, decimal.nroPrecio);
          data.price = roundNumber(precioUnitario, decimal.nroPrecio);

        } catch (error) {
          self.tS.toastr({
            type: 'error',
            message: `CÁLCULO DE PRECIO CON IVA: ${error}`
          })
        }
      },

      'percentageDiscount': function () {
        try {

          if (percentageDiscount === oldValue) return
          //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
          if (data.percentageDiscount <= 100) {
            let valorDescuento = pricingCalculateUtil.getValueDiscount(data.price, percentageDiscount);

            data.percentageDiscount = roundNumber(percentageDiscount, decimal.nroPorcentaje);
            data.discount = roundNumber(data.quantity * valorDescuento, decimal.nroDescuentoDetalle);

          } else {
            data.percentageDiscount = Number(oldValue);
            self.tS.toastr({
              type: 'warning',
              message: 'El Porcentaje tiene que ser menor o igual a 100',
              title: 'Cálculo de Porcentaje Descuento'
            })
          }

          data.percentageDiscount = roundNumber(percentageDiscount, decimal.nroPorcentaje);

        } catch (error) {
          self.tS.toastr({
            type: 'error',
            message: `CÁLCULO DE PORCENTAJE DE DESCUENTO: ${error}`,
            title: 'Cálculo de Porcentaje Descuento'
          })
        }
      },


      'discount': function () {
        try {

          if (discount === oldValue) return

          let subTotal = ((data.price * data.quantity))

          if (discount <= subTotal) {

            let porcentajeDescuento = pricingCalculateUtil.getValueDiscountPercentage(subTotal, discount);

            data.discount = roundNumber(discount, decimal.nroDescuentoDetalle);
            data.percentageDiscount = roundNumber(porcentajeDescuento, decimal.nroPorcentaje);

          } else {
            data.discount = Number(oldValue);
            self.tS.toastr({
              type: 'warning',
              message: 'El descuento no puede ser mayor al subtotal',
              title: 'Descuento'
            })
          }

          data.discount = roundNumber(data.discount, decimal.nroDescuentoDetalle);

        } catch (error) {
          self.tS.toastr({
            type: 'warning',
            message: `CÁLCULO DE VALOR DE DESCUENTO: ${error}`,
            title: 'Descuento'
          })
        }
      },

      "calculateTotal": function () {
        try {
          let precioTotalSinImpuesto = ((data.price * data.quantity)) - data.discount;
          let valorImpuesto = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, dataTarifaImpuesto.porcentaje);
          let total = precioTotalSinImpuesto + valorImpuesto;
          // let totalIce = data.cantidad * rowEntity.ice;

          data.precioTotalSinImpuesto = roundNumber(precioTotalSinImpuesto, decimal.nroPrecio);
          data.taxValue = roundNumber(valorImpuesto, decimal.nroPrecio)
          data.total = roundNumber(total, decimal.nroTotalDetalle);

        } catch (error) {
          self.tS.toastr({
            type: 'error',
            message: `CÁLCULO DE TOTAL: ${error}`,
            title: 'Calculate totals detail'
          })
        }
      },

    }

    calculoColumnas[column] && calculoColumnas[column]();

    calculoColumnas["calculateTotal"]();

    return data;
  }



  getTaxTotals(obj: TaxTotalProps) {
    // Desestructurar el objeto de entrada
    let { items, decimal, tarifasImpuesto } = obj;
    console.log(items)
    if (!decimal) {
      decimal = {
        nroTotalSubTotal: 2,
        nroIva: 2,
        importeTotal: 2
      }
    }

    // Inicializar las variables para almacenar los totales de impuestos
    let htmlImpuestoTotal = '', htmlIvaTotal = '', sumTotalIva = 0, totalPorcentajeDescuento = 0;

    // Calcular totales generales
    let { totalPrecioTotalSinImpuesto, totalIce, totalDescuento, totalSinImpuesto } = items.reduce((acc, prev) => {
      // Calcular el total neto con descuentos y el total de ICE
      let totalSinImpuesto = prev.quantity * prev.price;
      let precioTotalSinImpuesto = ((prev.quantity * prev.price) - prev.discount);

      let totalIce = prev.quantity * 0;

      // Acumular totales generales
      acc.totalIce += totalIce;
      acc.totalPrecioTotalSinImpuesto += precioTotalSinImpuesto;
      acc.totalDescuento += prev.discount;
      acc.totalSinImpuesto += totalSinImpuesto;
      return acc;
    }, {
      totalPrecioTotalSinImpuesto: 0,
      totalIce: 0,
      totalDescuento: 0,
      totalSinImpuesto: 0

    });

    // Calcular totales específicos por tarifa de impuesto
    for (let dataTarifaImpuesto of tarifasImpuesto) {
      let filteredItems = items.filter(item => item.taxPercentId === dataTarifaImpuesto.idTarifaImpuesto);

      let { totalNetoIva } = filteredItems.reduce((acc, prev) => {
        let precioTotalSinImpuesto = (prev.price * prev.quantity) - prev.discount;
        acc.totalNetoIva += precioTotalSinImpuesto;
        return acc;
      }, {
        totalNetoIva: 0
      });

      // Construir el HTML para la tabla de impuestos
      if (totalNetoIva > 0) {
        htmlImpuestoTotal += `<tr>
                                    <td class="left">
                                        <span class="text-dark">Subtotal ${dataTarifaImpuesto.descripcion}</span>
                                    </td>
                                    <td class="right">$${roundNumber(totalNetoIva, decimal.nroTotalSubTotal)}</td>
                                </tr>`;

      }

      if (dataTarifaImpuesto.porcentaje > 0) {
        let { totalIva } = filteredItems.reduce((acc, prev) => {
          let precioTotalSinImpuesto = (prev.price * prev.quantity) - prev.discount;
          if (dataTarifaImpuesto.idTarifaImpuesto == prev.taxPercentId) {
            acc.totalIva += pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, dataTarifaImpuesto.porcentaje);
          }
          return acc;
        }, {
          totalIva: 0,
        });

        sumTotalIva += totalIva;
        if (totalIva > 0) {
          htmlIvaTotal += `
                                    <tr>
                                        <td class="left">
                                            <span class="text-dark">${dataTarifaImpuesto.descripcion}</span>
                                        </td>
                                        <td class="right">$${roundNumber(totalIva, decimal.nroIva)}</td>
                                    </tr>`

        }

      }
    }

    const importeTotal = totalPrecioTotalSinImpuesto + sumTotalIva;
    if (totalSinImpuesto > 0) {
      totalPorcentajeDescuento = ((totalSinImpuesto - totalPrecioTotalSinImpuesto) * 100) / totalSinImpuesto;
    }
    // Retornar los totales calculados
    return {
      subTotalSinImpuesto: roundNumber(totalPrecioTotalSinImpuesto, decimal.nroTotalSubTotal),
      totalIce,
      irbpnr: 0,
      propina: 0,
      discount: roundNumber(totalDescuento, decimal.nroTotalSubTotal),
      percentageDiscount: roundNumber(totalPorcentajeDescuento, 1),
      htmlImpuestoTotal,
      htmlIvaTotal,
      importeTotal: roundNumber(importeTotal, decimal.importeTotal)
    };
  };

}
