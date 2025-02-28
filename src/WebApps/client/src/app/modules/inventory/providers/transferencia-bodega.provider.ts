import {ClassProvider} from "@angular/core";
import {TransferenciaBodegaRepository} from "@inventory/domain/repositories/transferencia-bodega.repository";
import {
  TransferenciaBodegaWebRepository
} from "@inventory/data/transferencia-bodega/transferencia-bodega-web.repository";

export const transferenciaBodegaProvider:ClassProvider = {
  provide: TransferenciaBodegaRepository,
  useClass: TransferenciaBodegaWebRepository,
}

