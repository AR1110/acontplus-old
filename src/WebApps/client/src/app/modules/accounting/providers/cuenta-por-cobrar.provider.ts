import {ClassProvider} from "@angular/core";
import {
  CuentaPorCobrarWebRepository
} from "@accounting/data/cuenta-por-cobrar/cuenta-por-cobrar-web.repository";
import {CuentaPorCobrarRepository} from "@accounting/domain/repositories/cuenta-por-cobrar.repository";


export const cuentaPorCobrarProvider:ClassProvider = {
  provide: CuentaPorCobrarRepository,
  useClass: CuentaPorCobrarWebRepository
}
