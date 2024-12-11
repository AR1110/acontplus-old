import {ClassProvider} from "@angular/core";
import {SubEntidadFinancieraRepository} from "@accounting/core/repositories/sub-entidad-financiera.repository";
import {
  SubEntidadFinancieraRepositoryImpl
} from "@accounting/data/repository/sub-entidad-financiera/sub-entidad-financiera.repository.impl";


export const subEntidadFinancieraProvider:ClassProvider = {
  provide: SubEntidadFinancieraRepository,
  useClass: SubEntidadFinancieraRepositoryImpl
}
