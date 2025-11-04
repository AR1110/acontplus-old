import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { GuiaRemisionRepository } from '@billing/domain/repositories/guia-remision.repository';
import { GuiaRemisionFilterData } from '@billing/domain/models/guia-remision/guia-remision.model';

@Injectable({
  providedIn: 'root',
})
export class GetGuiaRemisionFilterDataUseCase implements BaseUseCase<GuiaRemisionFilterData, void> {
  private repo = inject(GuiaRemisionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute() {
    return this.repo.getFilterData();
  }
}
