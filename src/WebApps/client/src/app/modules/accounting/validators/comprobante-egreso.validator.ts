import {CuentaPorPagarLista} from "@accounting/core/domain/cuenta-por-pagar.model";
import {PagoDetalle} from "@accounting/core/domain/pago-detalle.model";
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial, CuotaPorPagarEstado,
  FormaPago
} from "@accounting/core/domain/comprobante-egreso.interface";

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
