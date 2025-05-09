import {CuentaPorPagarLista} from "@accounting/domain/models/cuenta-por-pagar.model";
import {PagoDetalle} from "@accounting/domain/models/pago-detalle.model";
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial, CuotaPorPagarEstado,
  FormaPago
} from "@accounting/domain/models/comprobante-egreso.model";

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
