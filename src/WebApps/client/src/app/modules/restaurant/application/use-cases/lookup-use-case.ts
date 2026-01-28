import { inject, Injectable } from '@angular/core';
import { LookupRepository } from '@restaurant/data/repositories/lookup-repository';
import { BaseUseCase } from '@core/base-use-case';
import { LookupType } from '@core/models/lookup-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupListUseCase implements BaseUseCase<any, { type: LookupType; keys: string }> {
  execute(params: { type: LookupType; keys: string }): Observable<any> {
    return this.#repo.getLookups(params);
  }
  #repo = inject(LookupRepository);
}
