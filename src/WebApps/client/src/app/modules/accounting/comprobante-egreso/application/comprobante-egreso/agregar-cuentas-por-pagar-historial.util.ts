import { CuentaPorPagarCuota } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';

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
