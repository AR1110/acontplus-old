import { EmailQueueRepository } from '@modules/common/core/repositories/email-queue-repository';
import { EmailQueueWebRepository } from '@modules/common/data/email-queue/email-queue-web-repository';
import { UserManualRepository } from '@modules/common/core/repositories/user-manual.repository';
import { UserManualWebRepository } from '@modules/common/data/user-manual/user-manual-web-repository';
import { DashboardRepository } from '@modules/common/core/repositories/dashboard.repository';
import { DashboardHttpRepository } from '@modules/common/data/dashboard-http.repository';

export const commonProviders = [
  {
    provide: EmailQueueRepository,
    useClass: EmailQueueWebRepository,
  },
  {
    provide: UserManualRepository,
    useClass: UserManualWebRepository,
  },
  {
    provide: DashboardRepository,
    useClass: DashboardHttpRepository,
  },
];
