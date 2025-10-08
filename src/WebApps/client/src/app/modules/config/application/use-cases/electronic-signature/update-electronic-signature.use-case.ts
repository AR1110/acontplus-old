import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ElectronicSignatureParam } from '@modules/config/domain/models/electronic-signature.model';
import { ElectronicSignatureRepository } from '@modules/config/domain/repositories/electronic-signature.repository';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateElectronicSignatureUseCase
  implements BaseUseCase<ApiResponse, ElectronicSignatureParam>
{
  constructor(private repo: ElectronicSignatureRepository) {}

  execute(params: ElectronicSignatureParam): Observable<ApiResponse<unknown>> {
    return this.repo.update(params);
  }
}
