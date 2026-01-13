import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigRepository } from '@modules/config/data/repositories/doc-config.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CreateDocConfigUseCase implements BaseUseCase<ApiResponseLegacy, number> {
  private repo = inject(DocConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any): Observable<ApiResponseLegacy> {
    return this.repo.create(params);
  }
}
