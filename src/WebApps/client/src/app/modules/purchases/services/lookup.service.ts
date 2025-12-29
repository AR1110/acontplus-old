import { inject, Injectable } from '@angular/core';

// Import by developer.
import { LookUpRepository } from '../data/repositories/lookup-repositoriy';
import { LookupType } from '@core/models/lookup-type';

@Injectable({
  providedIn: 'root',
})
export class LookUpService {
  #lookupRepository = inject(LookUpRepository);

  getLookup(params: { type: LookupType; keys: string }) {
    return this.#lookupRepository.getLookup(params);
  }
}
