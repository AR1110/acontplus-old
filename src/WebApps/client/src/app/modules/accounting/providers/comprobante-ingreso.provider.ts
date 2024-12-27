import {ClassProvider} from "@angular/core";
import {ComprobanteIngresoRepository} from "@accounting/core/repositories/comprobante-ingreso.repository";

import {
  ComprobanteIngresoWebRepository
} from "@accounting/data/comprobante-ingreso/comprobante-ingreso-web.repository";


export const comprobanteIngresoProvider:ClassProvider = {
  provide: ComprobanteIngresoRepository,
  useClass: ComprobanteIngresoWebRepository
}
