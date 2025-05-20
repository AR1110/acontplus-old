import {ClassProvider} from "@angular/core";
import {
  SubEntidadFinancieraWebRepository
} from "@accounting/data/sub-entidad-financiera/sub-entidad-financiera-web.repository";
import {SubEntidadFinancieraRepository} from "@accounting/domain/repositories/sub-entidad-financiera.repository";


export const subEntidadFinancieraProvider:ClassProvider = {
  provide: SubEntidadFinancieraRepository,
  useClass: SubEntidadFinancieraWebRepository
}
