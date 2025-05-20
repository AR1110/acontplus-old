import { DocumentoElectronicoWebRepository } from '@billing/data/documento-electronico/documento-electronico-web.repository';
import { DocumentoElectronicoRepository } from '@billing/domain/repositories/documento-electronico.repository';

export const documentoElectronicoProvider = {
  provide: DocumentoElectronicoRepository,
  useClass: DocumentoElectronicoWebRepository,
};
