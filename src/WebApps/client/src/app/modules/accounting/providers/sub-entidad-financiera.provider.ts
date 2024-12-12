import {ClassProvider} from "@angular/core";
import {SubEntidadFinancieraRepository} from "@accounting/core/repositories/sub-entidad-financiera.repository";
import {
  SubEntidadFinancieraWebRepository
} from "@accounting/data/sub-entidad-financiera/sub-entidad-financiera-web.repository";


export const subEntidadFinancieraProvider:ClassProvider = {
  provide: SubEntidadFinancieraRepository,
  useClass: SubEntidadFinancieraWebRepository
}
