import { BaseUseCase } from '@core/base-use-case';
import { ListCreditTimeResponse } from '@modules/config/data/models/tiempo-credito.model';
import { CreditTimeRepository } from '@modules/config/data/repositories/credit-time.repository';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListCreditTimeUseCase implements BaseUseCase<ListCreditTimeResponse, any> {
  private repo = inject(CreditTimeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any): Observable<ListCreditTimeResponse> {
    return this.repo.list(params);
  }
}
