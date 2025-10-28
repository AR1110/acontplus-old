import { BaseUseCase } from '@core/base-use-case';
import { ListCreditTimeResponse } from '@modules/config/domain/models/tiempo-credito.model';
import { CreditTimeRepository } from '@modules/config/domain/repositories/credit-time.repository';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListCreditTimeUseCase implements BaseUseCase<ListCreditTimeResponse, any> {
  constructor(private repo: CreditTimeRepository) {}

  execute(params: any): Observable<ListCreditTimeResponse> {
    return this.repo.list(params);
  }
}
