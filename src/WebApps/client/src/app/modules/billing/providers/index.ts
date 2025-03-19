import {
  docSustentoProvider,
  retencionAtsProvider,
} from './retencion-ats.provider';
import {guiaRemisionProvider} from "@billing/providers/guia-remision.provider";

export const billingProviders = [retencionAtsProvider, docSustentoProvider, guiaRemisionProvider];
