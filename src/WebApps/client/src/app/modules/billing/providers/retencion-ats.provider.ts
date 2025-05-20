import { ClassProvider } from '@angular/core';
import { RetencionAtsRepository } from '@billing/domain/repositories/retencion-ats/retencion-ats.repository';
import { RetencionAtsWebRepository } from '../data/retencion-ats/retencion-ats-web.repository';
import { DocSustentoRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento.repository';
import { DocSustentoWebRepository } from '@billing/data/retencion-ats/doc-sustento-web.repository';
import { DocSustentoTaxRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-tax.repository';
import { DocSustentoTaxWebRepository } from '@billing/data/retencion-ats/doc-sustento-tax-web.repository';
import { DocSustentoPaymentRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-payment.repository';
import { DocSustentoPaymentWebRepository } from '@billing/data/retencion-ats/doc-sustento-payment-web.repository';
import { DocSustentoRetencionRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-retencion.repository';
import { DocSustentoRetencionWebRepository } from '../data/retencion-ats/doc-sustento-retencion-web.repository';

export const retencionAtsProvider: ClassProvider = {
  provide: RetencionAtsRepository,
  useClass: RetencionAtsWebRepository,
};

export const docSustentoProvider: ClassProvider = {
  provide: DocSustentoRepository,
  useClass: DocSustentoWebRepository,
};

export const docSustentoTaxProvider: ClassProvider = {
  provide: DocSustentoTaxRepository,
  useClass: DocSustentoTaxWebRepository,
};

export const docSustentoPaymentProvider: ClassProvider = {
  provide: DocSustentoPaymentRepository,
  useClass: DocSustentoPaymentWebRepository,
};

export const docSustentoRetencionProvider: ClassProvider = {
  provide: DocSustentoRetencionRepository,
  useClass: DocSustentoRetencionWebRepository,
};
