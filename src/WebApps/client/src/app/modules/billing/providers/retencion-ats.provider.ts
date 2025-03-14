import { ClassProvider } from '@angular/core';
import { RetencionAtsRepository } from '@billing/domain/repositories/retencion-ats.repository';
import { RetencionAtsWebRepository } from '../data/retencion-ats/retencion-ats-web.repository';
import { DocSustentoRepository } from '@billing/domain/repositories/doc-sustento.repository';
import { DocSustentoWebRepository } from '@billing/data/retencion-ats/doc-sustento-web.repository';

export const retencionAtsProvider: ClassProvider = {
  provide: RetencionAtsRepository,
  useClass: RetencionAtsWebRepository,
};

export const docSustentoProvider: ClassProvider = {
  provide: DocSustentoRepository,
  useClass: DocSustentoWebRepository,
};
