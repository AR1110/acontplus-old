import {ClassProvider} from "@angular/core";
import {
  ComprobanteEgresoWebRepository
} from "@accounting/data/comprobante-egreso/comprobante-egreso-web.repository";
import {ComprobanteEgresoRepository} from "@accounting/domain/repositories/comprobante-egreso.repository";


export const comprobanteEgresoProvider:ClassProvider = {
  provide: ComprobanteEgresoRepository,
  useClass: ComprobanteEgresoWebRepository
}
