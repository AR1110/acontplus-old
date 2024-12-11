import {ClassProvider} from "@angular/core";
import {CuentaPorPagarRepository} from "@accounting/core/repositories/cuenta-por-pagar.repository";
import {
  CuentaPorPagarRepositoryImpl
} from "@accounting/data/repository/cuenta-por-pagar/cuenta-por-pagar.repository.impl";


export const cuentaPorPagarProvider:ClassProvider = {
  provide: CuentaPorPagarRepository,
  useClass: CuentaPorPagarRepositoryImpl
}
