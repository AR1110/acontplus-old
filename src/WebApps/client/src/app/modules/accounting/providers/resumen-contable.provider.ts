import {ClassProvider} from "@angular/core";
import {ResumenContableWebRepository} from "@accounting/data/resumen-contable/resumen-contable-web.repository";
import {ResumenContableRepository} from "@accounting/domain/repositories/resumen-contable.repository";


export const resumenContableProvider:ClassProvider = {
  provide: ResumenContableRepository,
  useClass: ResumenContableWebRepository
}
