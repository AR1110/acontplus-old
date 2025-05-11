import {ClassProvider} from "@angular/core";
import {CajaWebRepository} from "@accounting/data/caja/caja-web.repository";
import {CajaRepository} from "@accounting/domain/repositories/caja.repository";


export const cajaProvider:ClassProvider = {
  provide: CajaRepository,
  useClass: CajaWebRepository
}
