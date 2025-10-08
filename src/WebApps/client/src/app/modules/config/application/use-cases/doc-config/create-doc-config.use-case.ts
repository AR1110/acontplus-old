import { BaseUseCase } from '@core/base-use-case';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CreateDocConfigUseCase implements BaseUseCase<ApiResponse, number> {
  constructor(private repo: DocConfigRepository) {}

  execute(params: any): Observable<ApiResponse> {
    return this.repo.create(params);
  }
}
