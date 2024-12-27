import { ClassProvider } from '@angular/core';
import { EmailQueueRepository } from '@modules/common/core/repositories/email-queue-repository';
import { EmailQueueWebRepository } from '@modules/common/data/email-queue/email-queue-web-repository';

export const emailQueueProvider: ClassProvider = {
  provide: EmailQueueRepository,
  useClass: EmailQueueWebRepository,
};
