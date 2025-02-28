import {ClassProvider} from "@angular/core";
import {NotaEntregaRepository} from "@sale/domain/repositories/nota-entrega.repository";
import {NotaEntregaWebRepository} from "@sale/data/nota-entrega/nota-entrega-web.service";

export const notaEntregaProvider: ClassProvider={
  provide : NotaEntregaRepository,
  useClass: NotaEntregaWebRepository
}
