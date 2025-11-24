import { computed, inject, Injectable, signal } from '@angular/core';
import { LookupListUseCase } from '@restaurant/application/use-cases/lookup-use-case';
import { LookupItem } from '@core/models/lookup-type';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  lookupListUseCase = inject(LookupListUseCase);
  establishments = signal<LookupItem[]>([]);
  taxes = signal<LookupItem[]>([]);

  getLookupList(keys: string) {
    return this.lookupListUseCase.execute({
      type: {
        module: 'Promotions',
        context: 'Forms',
      },
      keys,
    });
  }
}
