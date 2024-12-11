import {ClassProvider} from "@angular/core";
import {CajaRepository} from "@accounting/core/repositories/caja.repository";
import {CajaWebRepository} from "@accounting/data/repository/caja/caja-web.repository";


export const cajaProvider:ClassProvider = {
  provide: CajaRepository,
  useClass: CajaWebRepository
}
