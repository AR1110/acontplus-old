import { BaseUseCase } from '@core/base-use-case';
import { CreditTimeRepository } from '@modules/config/data/repositories/credit-time.repository';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CreditTimeList } from '@modules/config/data/models/tiempo-credito.model';

@Injectable({
  providedIn: 'root',
})
export class DeleteCreditTimeUseCase
  implements BaseUseCase<ApiResponseLegacy, Partial<CreditTimeList>>
{
  private repo = inject(CreditTimeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<CreditTimeList>): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.delete(params);
  }
}
