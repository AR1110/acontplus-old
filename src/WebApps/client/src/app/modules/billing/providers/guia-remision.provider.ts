import { ClassProvider } from '@angular/core';
import { GuiaRemisionRepository } from '@billing/domain/repositories/guia-remision.repository';
import { GuiaRemisionRepositoryImpl } from '@billing/data/guia-remision/guia-remision-repository-impl';

export const guiaRemisionProvider: ClassProvider = {
  provide: GuiaRemisionRepository,
  useClass: GuiaRemisionRepositoryImpl,
};
