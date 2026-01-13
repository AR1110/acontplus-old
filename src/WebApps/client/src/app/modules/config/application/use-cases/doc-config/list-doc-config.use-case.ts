import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigListResponse } from '@modules/config/data/models/doc-config.model';
import { DocConfigRepository } from '@modules/config/data/repositories/doc-config.repository';

@Injectable({
  providedIn: 'root',
})
export class ListDocConfigUseCase implements BaseUseCase<DocConfigListResponse, number> {
  private repo = inject(DocConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(puntoEmisionId: number): Observable<DocConfigListResponse> {
    return this.repo.list(puntoEmisionId);
  }
}
