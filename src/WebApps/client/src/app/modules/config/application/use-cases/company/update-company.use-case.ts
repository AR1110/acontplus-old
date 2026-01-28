import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { CompanyList } from '@modules/config/data/models/company.model';
import { CompanyRepository } from '@modules/config/data/repositories/company.repository';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateCompanyUseCase implements BaseUseCase<ApiResponseLegacy, Partial<CompanyList>> {
  private repo = inject(CompanyRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<CompanyList>): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.update(params);
  }
}
