import {ClassProvider} from "@angular/core";
import {ControlCajaRepository} from "@accounting/core/repositories/control-caja.repository";
import {ControlCajaWebRepository} from "@accounting/data/control-caja/control-caja-web.repository";


export const controlCajaProvider:ClassProvider = {
  provide: ControlCajaRepository,
  useClass: ControlCajaWebRepository
}
