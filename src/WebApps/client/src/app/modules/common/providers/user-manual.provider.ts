import { ClassProvider } from '@angular/core';
import { UserManualRepository } from '@modules/common/core/repositories/user-manual.repository';
import { UserManualWebRepository } from '@modules/common/data/user-manual/user-manual-web-repository';

export const userManualProvider: ClassProvider = {
  provide: UserManualRepository,
  useClass: UserManualWebRepository,
};
