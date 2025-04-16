import { CuentaPorPagarCuota } from "../../core/models/comprobante-egreso.model";

interface Props {
  secuencial: number
  dataCuentaPorPagarCuota: CuentaPorPagarCuota

}
export class AgregarCuentasPorPagarHistorial {
  secuencial: number
  dataCuentaPorPagarCuota: CuentaPorPagarCuota
  constructor({secuencial, dataCuentaPorPagarCuota}: Props) {
    this.secuencial = secuencial;
    this.dataCuentaPorPagarCuota  = dataCuentaPorPagarCuota;

  }



}
