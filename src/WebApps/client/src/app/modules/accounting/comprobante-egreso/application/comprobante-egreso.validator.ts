import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import { PagoDetalle } from '@accounting/comprobante-egreso/domain/pago-detalle.model';
import {
  CuentaPorPagarEstado,
  CuentaPorPagarHistorial,
  CuotaPorPagarEstado,
  FormaPago,
} from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';

interface ParamsGuardar {
  dataCuentaPorPagar: CuentaPorPagarLista;
  total: number;
  formasPago: FormaPago[];
  pagosDetalle: PagoDetalle[];
  cuentasPorPagarEstado: CuentaPorPagarEstado[];
  cuotasPorPagarEstado: CuotaPorPagarEstado[];
  cuentaPorPagarHistorial: CuentaPorPagarHistorial[];
}

export class ComprobanteEgresoValidator {
  static validarCamposGuardar(obj: ParamsGuardar) {}
}
