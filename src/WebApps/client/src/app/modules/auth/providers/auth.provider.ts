import { ClassProvider } from '@angular/core';
import { AuthRepository } from '@modules/auth/domain/repositories/auth.repository';
import { AuthWebRepository } from '../data/auth/auth-web.repository';

export const authProvider: ClassProvider = {
  provide: AuthRepository,
  useClass: AuthWebRepository,
};
