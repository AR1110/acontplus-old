import {
  docSustentoProvider,
  retencionAtsProvider,
} from './retencion-ats.provider';
import { guiaRemisionProvider } from '@billing/providers/guia-remision.provider';
import { documentoElectronicoProvider } from '@billing/providers/documento-electronico.provider';

export const billingProviders = [
  documentoElectronicoProvider,
  retencionAtsProvider,
  docSustentoProvider,
  guiaRemisionProvider,
];
