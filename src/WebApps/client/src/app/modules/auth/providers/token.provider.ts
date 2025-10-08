import { ClassProvider } from '@angular/core';
import { TokenRepository } from '../domain/repositories/token.repository';
import { TokenLocalStorageRepository } from '../data/token/token-local-storage.repository';

export const tokenProvider: ClassProvider = {
  provide: TokenRepository,
  useClass: TokenLocalStorageRepository,
};
