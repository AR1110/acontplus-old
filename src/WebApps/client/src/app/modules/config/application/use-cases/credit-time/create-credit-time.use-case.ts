import { BaseUseCase } from '@core/base-use-case';
import { CreditTimeRepository } from '@modules/config/data/repositories/credit-time.repository';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CreateCreditTimeUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(CreditTimeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any): Observable<ApiResponseLegacy> {
    return this.repo.create(params);
  }
}
