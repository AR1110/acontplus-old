import { BaseUseCase } from '@core/base-use-case';
import { CreditTimeRepository } from '@modules/config/domain/repositories/credit-time.repository';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { CreditTimeList } from '@modules/config/domain/models/tiempo-credito.model';

@Injectable({
  providedIn: 'root',
})
export class DeleteCreditTimeUseCase implements BaseUseCase<ApiResponse, Partial<CreditTimeList>> {
  private repo = inject(CreditTimeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<CreditTimeList>): Observable<ApiResponse<unknown>> {
    return this.repo.delete(params);
  }
}
