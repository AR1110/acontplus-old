import { CuentaPorPagarCuota } from "../../core/domain/comprobante-egreso.interface";

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
