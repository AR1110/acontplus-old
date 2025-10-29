import { DocElectHttpRepository } from '@billing/data/documento-electronico/doc-elect-http.repository';
import { DocumentoElectronicoRepository } from '@billing/domain/repositories/documento-electronico.repository';

export const documentoElectronicoProvider = {
  provide: DocumentoElectronicoRepository,
  useClass: DocElectHttpRepository,
};
