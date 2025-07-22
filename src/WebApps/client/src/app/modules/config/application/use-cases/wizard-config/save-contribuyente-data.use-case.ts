import { Injectable, Inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { Contribuyente } from '@modules/config/domain/models/wizard-config/contribuyente.model';
import { Observable } from 'rxjs';
import { ContribuyenteRepository } from '@modules/config/domain/repositories/contribuyente.repository';

@Injectable({
  providedIn: 'root',
})
export class SaveContribuyenteDataUseCase implements BaseUseCase<ApiResponse, { contribuyente: Contribuyente }> {
  constructor(
    @Inject(ContribuyenteRepository) private repo: ContribuyenteRepository // TODO: Provide concrete implementation in module providers
  ) {}

  execute(params: { contribuyente: Contribuyente }): Observable<ApiResponse> {
    return this.repo.save(params.contribuyente);
  }
}
