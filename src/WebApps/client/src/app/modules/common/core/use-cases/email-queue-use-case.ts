import { inject, Injectable } from '@angular/core';
import { EmailQueueRepository } from '@modules/common/core/repositories/email-queue-repository';

@Injectable({
  providedIn: 'root',
})
export class EmailQueueUseCase {
  private readonly _emailQueueRepository = inject(EmailQueueRepository);

  send<T>(parameters: T) {
    return this._emailQueueRepository.send<T>(parameters);
  }
}
