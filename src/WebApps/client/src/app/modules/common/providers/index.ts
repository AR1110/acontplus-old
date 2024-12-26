import { userManualProvider } from '@modules/common/providers/user-manual.provider';
import { emailQueueProvider } from '@modules/common/providers/email-queue.provider';

export const commonProviders = [emailQueueProvider, userManualProvider];
