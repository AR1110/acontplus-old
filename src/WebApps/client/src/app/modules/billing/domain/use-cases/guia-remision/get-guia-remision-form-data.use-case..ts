import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { GuiaRemisionRepository } from '@billing/domain/repositories/guia-remision.repository';
import { GuiaRemisionDataForm } from '@billing/domain/models/guia-remision/guia-remision.model';

@Injectable({
  providedIn: 'root',
})
export class GetGuiaRemisionFormDataUseCase implements BaseUseCase<GuiaRemisionDataForm, void> {
  constructor(private repo: GuiaRemisionRepository) {}

  execute() {
    return this.repo.getFormData();
  }
}
