import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CreateDocConfigUseCase implements BaseUseCase<ApiResponse, number> {
  private repo = inject(DocConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any): Observable<ApiResponse> {
    return this.repo.create(params);
  }
}
