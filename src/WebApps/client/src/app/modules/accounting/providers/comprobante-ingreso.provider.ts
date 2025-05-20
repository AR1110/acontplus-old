import {ClassProvider} from "@angular/core";

import {
  ComprobanteIngresoWebRepository
} from "@accounting/data/comprobante-ingreso/comprobante-ingreso-web.repository";
import {ComprobanteIngresoRepository} from "@accounting/domain/repositories/comprobante-ingreso.repository";


export const comprobanteIngresoProvider:ClassProvider = {
  provide: ComprobanteIngresoRepository,
  useClass: ComprobanteIngresoWebRepository
}
