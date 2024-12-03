import { CuentaPorPagar } from './../cuenta-por-pagar/interfaces/cuenta-por-pagar.interface';

import { CuentaPorPagarLista } from "@accounting/cuenta-por-pagar/interfaces/cuenta-por-pagar.interface";
import { CuotaPorPagarLista } from "@accounting/interfaces/cuota-por-pagar.interface";

interface ComprobanteEgreso {
  idComprobanteEgreso: number
  fechaEmision: string
  serieComprobante: string
  total: number
  nombreEstado: string
  estado: boolean
  codEstab: string
}

export interface ComprobanteEgresoLista extends ComprobanteEgreso {
  index: number

}

export interface CuentaPorPagarCuota extends CuentaPorPagarLista {
  cuotas: CuotaPorPagarLista[]
  cuotasCopy: CuotaPorPagarLista[]
}

export interface CuentaPorPagarHistorial extends Pick<CuentaPorPagar, "idCuentaPorPagar"> {
  secuencial: number
  // valorSaldoLectura: this.group.valorSaldoLectura,

  abono: number
  saldo: number


  // diasMora: this.group.diasMora,
  // mora: this.group.mora,
}
