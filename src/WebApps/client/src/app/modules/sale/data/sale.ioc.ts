import { Provider } from '@angular/core';
import { NotaEntregaRepository } from '@sale/domain/repositories/nota-entrega.repository';
import { NotaEntregaWebRepository } from '@sale/data/nota-entrega/nota-entrega-web.service';
import { ProformaRepository } from '@sale/domain/repositories/proforma.repository';
import { ProformaHttpRepository } from '@sale/data/proforma/proforma-http-repository';
export const DATA_SALE_IOC: Provider[] = [
  {
    provide: NotaEntregaRepository,
    useClass: NotaEntregaWebRepository,
  },
  {
    provide: ProformaRepository,
    useClass: ProformaHttpRepository,
  },
];
