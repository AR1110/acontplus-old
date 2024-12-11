import {ClassProvider} from "@angular/core";
import {ComprobanteIngresoRepository} from "@accounting/core/repositories/comprobante-ingreso.repository";
import {
  CompIngresoApiDelayRepository
} from "@accounting/data/repository/comprobante-ingreso/comp-ingreso-api-delay.repository";
import {
  CompIngresoApiRepository
} from "@accounting/data/repository/comprobante-ingreso/comp-ingreso-api.repository";


export const comprobanteIngresoProvider:ClassProvider = {
  provide: ComprobanteIngresoRepository,
  useClass: CompIngresoApiRepository
}
