import {ClassProvider} from "@angular/core";
import {CuentaPorCobrarRepository} from "@accounting/core/repositories/cuenta-por-cobrar.repository";
import {
  CuentaPorCobrarWebRepository
} from "@accounting/data/cuenta-por-cobrar/cuenta-por-cobrar-web.repository";


export const cuentaPorCobrarProvider:ClassProvider = {
  provide: CuentaPorCobrarRepository,
  useClass: CuentaPorCobrarWebRepository
}
