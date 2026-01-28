import { Injectable, Inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { DocConfig } from '@modules/config/data/models/doc-config.model';
import { Observable } from 'rxjs';
import { DocConfigRepository } from '@modules/config/data/repositories/doc-config.repository';

@Injectable({
  providedIn: 'root',
})
export class SaveDocConfigUseCase implements BaseUseCase<ApiResponseLegacy, DocConfig> {
  constructor(
    @Inject(DocConfigRepository) private repo: DocConfigRepository, // TODO: Provide concrete implementation in module providers
  ) {}

  execute(docConfig: DocConfig): Observable<ApiResponseLegacy> {
    return this.repo.save(docConfig);
  }
}
