import {ClassProvider} from "@angular/core";
import {MovimientoCajaRepository} from "@accounting/core/repositories/movimiento-caja.repository";
import {MovimientoCajaWebRepository} from "@accounting/data/movimiento-caja/movimiento-caja-web.repository";


export const movimientoCajaProvider:ClassProvider = {
  provide: MovimientoCajaRepository,
  useClass: MovimientoCajaWebRepository
}
