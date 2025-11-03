import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';
import { SupportRepository } from '@mechanical/domain/repositories/support.repository';
import { Observable } from 'rxjs';
import { FilterDataSupportResponse } from '@mechanical/domain/models/support.model';

@Injectable({
  providedIn: 'root',
})
export class FilterDataSupportUseCase implements BaseUseCase<FilterDataSupportResponse, any> {
  private repo = inject(SupportRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(): Observable<FilterDataSupportResponse> {
    return this.repo.getDataFilter();
  }
}
