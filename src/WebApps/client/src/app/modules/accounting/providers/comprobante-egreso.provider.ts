import {ClassProvider} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/core/repositories/comprobante-egreso.repository";
import {
  ComprobanteEgresoRepositoryImpl
} from "@accounting/data/repository/comprobante-egreso/comprobante-egreso.repository.impl";


export const comprobanteEgresoProvider:ClassProvider = {
  provide: ComprobanteEgresoRepository,
  useClass: ComprobanteEgresoRepositoryImpl
}
