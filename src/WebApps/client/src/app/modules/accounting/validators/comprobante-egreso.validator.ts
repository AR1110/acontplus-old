import {CuentaPorPagarLista} from "@accounting/core/models/cuenta-por-pagar.model";
import {PagoDetalle} from "@accounting/core/models/pago-detalle.model";
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial, CuotaPorPagarEstado,
  FormaPago
} from "@accounting/core/models/comprobante-egreso.model";

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
