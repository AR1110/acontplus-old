import {ClassProvider} from "@angular/core";
import {CuentaPorPagarRepository} from "@accounting/core/repositories/cuenta-por-pagar.repository";
import {
  CuentaPorPagarWebRepository
} from "@accounting/data/cuenta-por-pagar/cuenta-por-pagar-web.repository";


export const cuentaPorPagarProvider:ClassProvider = {
  provide: CuentaPorPagarRepository,
  useClass: CuentaPorPagarWebRepository
}
