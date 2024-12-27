import {ClassProvider} from "@angular/core";
import {InventarioModeloRepository} from "@inventory/domain/repositories/inventario-modelo.repository";
import {InventarioModeloWebRepository} from "@inventory/data/inventario-modelo/inventario-modelo-web.repository";

export const inventarioModeloProvider:ClassProvider = {
  provide: InventarioModeloRepository,
  useClass: InventarioModeloWebRepository
}

