import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { GuiaRemisionRepository } from '@billing/domain/repositories/guia-remision.repository';
import { GuiaRemisionDataForm } from '@billing/domain/models/guia-remision/guia-remision.model';

@Injectable({
  providedIn: 'root',
})
export class GetGuiaRemisionFormDataUseCase implements BaseUseCase<GuiaRemisionDataForm, void> {
  private repo = inject(GuiaRemisionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute() {
    return this.repo.getFormData();
  }
}
