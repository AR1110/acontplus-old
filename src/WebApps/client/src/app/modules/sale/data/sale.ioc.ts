import { Provider } from '@angular/core';
import { NotaEntregaRepository } from '@sale/domain/repositories/nota-entrega.repository';
import { NotaEntregaWebRepository } from '@sale/data/nota-entrega/nota-entrega-web.service';
import { ProformaInvoiceRepository } from '@sale/domain/repositories/proforma-invoice.repository';
import { ProformaInvoiceHttpRepository } from '@sale/data/proforma-invoice/proforma-invoice-http.repository';
export const DATA_SALE_IOC: Provider[] = [
  {
    provide: NotaEntregaRepository,
    useClass: NotaEntregaWebRepository,
  },
  {
    provide: ProformaInvoiceRepository,
    useClass: ProformaInvoiceHttpRepository,
  },
];
