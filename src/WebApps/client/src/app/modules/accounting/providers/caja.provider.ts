import {ClassProvider} from "@angular/core";
import {SubEntidadFinancieraRepository} from "@accounting/core/repositories/sub-entidad-financiera.repository";
import {
  SubEntidadFinancieraRepositoryImpl
} from "@accounting/data/repository/sub-entidad-financiera/sub-entidad-financiera.repository.impl";
import {CajaRepository} from "@accounting/core/repositories/caja.repository";
import {CajaRepositoryImpl} from "@accounting/data/repository/caja/caja.repository.impl";


export const cajaProvider:ClassProvider = {
  provide: CajaRepository,
  useClass: CajaRepositoryImpl
}
