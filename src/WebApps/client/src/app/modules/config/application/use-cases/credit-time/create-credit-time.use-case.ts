import { BaseUseCase } from '@core/base-use-case';
import { CreditTimeRepository } from '@modules/config/domain/repositories/credit-time.repository';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CreateCreditTimeUseCase implements BaseUseCase<ApiResponse, any> {
  private repo = inject(CreditTimeRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any): Observable<ApiResponse> {
    return this.repo.create(params);
  }
}
