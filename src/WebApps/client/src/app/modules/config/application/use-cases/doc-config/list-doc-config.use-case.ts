import { BaseUseCase } from '@core/base-use-case';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigListResponse } from '@modules/config/domain/models/doc-config.model';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';

@Injectable({
  providedIn: 'root',
})
export class ListDocConfigUseCase implements BaseUseCase<DocConfigListResponse, number> {
  constructor(private repo: DocConfigRepository) {}

  execute(puntoEmisionId: number): Observable<DocConfigListResponse> {
    return this.repo.list(puntoEmisionId);
  }
}
