import {ClassProvider} from "@angular/core";
import {MovimientoCajaWebRepository} from "@accounting/data/movimiento-caja/movimiento-caja-web.repository";
import {MovimientoCajaRepository} from "@accounting/domain/repositories/movimiento-caja.repository";


export const movimientoCajaProvider:ClassProvider = {
  provide: MovimientoCajaRepository,
  useClass: MovimientoCajaWebRepository
}
