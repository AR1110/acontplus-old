import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ListCompanyResponse } from '@modules/config/data/models/company.model';
import { CompanyRepository } from '@modules/config/data/repositories/company.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListCompanyUseCase implements BaseUseCase<ListCompanyResponse, any> {
  private repo = inject(CompanyRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(): Observable<ListCompanyResponse> {
    return this.repo.list();
  }
}
