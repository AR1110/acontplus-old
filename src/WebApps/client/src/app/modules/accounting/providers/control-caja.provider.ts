import {ClassProvider} from "@angular/core";
import {ControlCajaWebRepository} from "@accounting/data/control-caja/control-caja-web.repository";
import {ControlCajaRepository} from "@accounting/domain/repositories/control-caja.repository";


export const controlCajaProvider:ClassProvider = {
  provide: ControlCajaRepository,
  useClass: ControlCajaWebRepository
}
