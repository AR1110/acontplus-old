import {CuentaPorPagarLista} from "@accounting/cuenta-por-pagar/interfaces/cuenta-por-pagar.interface";
import {PagoDetalle} from "@accounting/cuenta-por-pagar/interfaces/pago-detalle.interface";
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial, CuotaPorPagarEstado,
  FormaPago
} from "@accounting/comprobante-egreso/comprobante-egreso.interface";

type ParamsGuardar = {
  dataCuentaPorPagar: CuentaPorPagarLista,
    total: number,
    formasPago: FormaPago[],
    pagosDetalle: PagoDetalle[],
    cuentasPorPagarEstado: CuentaPorPagarEstado[],
    cuotasPorPagarEstado: CuotaPorPagarEstado[],
    cuentaPorPagarHistorial: CuentaPorPagarHistorial[]

}


export class ComprobanteEgresoValidator {

  static validarCamposGuardar(obj:ParamsGuardar){




  }
}
