import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigFormDataResponse } from '@modules/config/data/models/doc-config.model';
import { DocConfigRepository } from '@modules/config/data/repositories/doc-config.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDocConfigFormDataUseCase implements BaseUseCase<DocConfigFormDataResponse, any> {
  private repo = inject(DocConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(): Observable<DocConfigFormDataResponse> {
    return this.repo.getFormData();
  }
}
