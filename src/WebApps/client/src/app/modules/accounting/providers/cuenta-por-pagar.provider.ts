import {ClassProvider} from "@angular/core";
import {
  CuentaPorPagarWebRepository
} from "@accounting/data/cuenta-por-pagar/cuenta-por-pagar-web.repository";
import {CuentaPorPagarRepository} from "@accounting/domain/repositories/cuenta-por-pagar.repository";


export const cuentaPorPagarProvider:ClassProvider = {
  provide: CuentaPorPagarRepository,
  useClass: CuentaPorPagarWebRepository
}
