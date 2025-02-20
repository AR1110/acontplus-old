import { ClassProvider } from '@angular/core';
import { RetencionAtsRepository } from '@billing/domain/repositories/retencion-ats.repository';
import { RetencionAtsWebRepository } from '../data/retencion-ats/retencion-ats-web.repository';

export const retencionAtsProvider: ClassProvider = {
  provide: RetencionAtsRepository,
  useClass: RetencionAtsWebRepository,
};
