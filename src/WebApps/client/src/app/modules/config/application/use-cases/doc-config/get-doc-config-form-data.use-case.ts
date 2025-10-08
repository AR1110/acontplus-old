import { BaseUseCase } from '@core/base-use-case';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigFormDataResponse } from '@modules/config/domain/models/doc-config.model';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDocConfigFormDataUseCase implements BaseUseCase<DocConfigFormDataResponse, any> {
  constructor(private repo: DocConfigRepository) {}

  execute(): Observable<DocConfigFormDataResponse> {
    return this.repo.getFormData();
  }
}
