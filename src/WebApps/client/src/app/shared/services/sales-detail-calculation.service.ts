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

    const calculoColumnas:any = {
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

          if (data.price === oldValue) return;

          let precioConIva = pricingCalculateUtil.calculatePriceWithVat(data.price, dataTarifaImpuesto.porcentaje);
          let valorDescuento = pricingCalculateUtil.getValueDiscount(data.price, data.percentageDiscount);

          data.price = roundNumber(data.price, decimal.nroPrecio);
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

          if (data.precioConIva === oldValue) return;

          let precioUnitario = pricingCalculateUtil.calculatePriceSale(data.precioConIva, dataTarifaImpuesto.porcentaje);

          data.precioConIva = roundNumber(data.precioConIva, decimal.nroPrecio);
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

          if (data.percentageDiscount === oldValue) return
          //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
          if (data.percentageDiscount <= 100) {
            let valorDescuento = pricingCalculateUtil.getValueDiscount(data.price, data.percentageDiscount);

            data.percentageDiscount = roundNumber(data.percentageDiscount, decimal.nroPorcentaje);
            data.discount = roundNumber(data.quantity * valorDescuento, decimal.nroDescuentoDetalle);

          } else {
            data.percentageDiscount = Number(oldValue);
            self.tS.toastr({
              type: 'warning',
              message: 'El Porcentaje tiene que ser menor o igual a 100',
              title: 'Cálculo de Porcentaje Descuento'
            })
          }

          data.percentageDiscount = roundNumber(data.percentageDiscount, decimal.nroPorcentaje);

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

          if (data.discount === oldValue) return

          let subTotal = ((data.price * data.quantity))

          if (data.discount <= subTotal) {

            let porcentajeDescuento = pricingCalculateUtil.getValueDiscountPercentage(subTotal, data.discount);

            data.discount = roundNumber(data.discount, decimal.nroDescuentoDetalle);
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
          console.log(data)
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
}
