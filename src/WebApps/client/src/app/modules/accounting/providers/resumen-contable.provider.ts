import {ClassProvider} from "@angular/core";
import {ResumenContableRepository} from "@accounting/core/repositories/resumen-contable.repository";
import {ResumenContableWebRepository} from "@accounting/data/resumen-contable/resumen-contable-web.repository";


export const resumenContableProvider:ClassProvider = {
  provide: ResumenContableRepository,
  useClass: ResumenContableWebRepository
}
