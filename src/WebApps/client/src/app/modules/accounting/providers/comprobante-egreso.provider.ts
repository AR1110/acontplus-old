import {ClassProvider} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/core/repositories/comprobante-egreso.repository";
import {
  ComprobanteEgresoWebRepository
} from "@accounting/data/repository/comprobante-egreso/comprobante-egreso-web.repository";


export const comprobanteEgresoProvider:ClassProvider = {
  provide: ComprobanteEgresoRepository,
  useClass: ComprobanteEgresoWebRepository
}
