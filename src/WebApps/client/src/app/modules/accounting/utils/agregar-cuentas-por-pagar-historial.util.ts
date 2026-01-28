import { CuentaPorPagarCuota } from '@accounting/data/models/comprobante-egreso.entity';

interface Props {
  secuencial: number;
  dataCuentaPorPagarCuota: CuentaPorPagarCuota;
}
export class AgregarCuentasPorPagarHistorial {
  secuencial: number;
  dataCuentaPorPagarCuota: CuentaPorPagarCuota;
  constructor({ secuencial, dataCuentaPorPagarCuota }: Props) {
    this.secuencial = secuencial;
    this.dataCuentaPorPagarCuota = dataCuentaPorPagarCuota;
  }
}
