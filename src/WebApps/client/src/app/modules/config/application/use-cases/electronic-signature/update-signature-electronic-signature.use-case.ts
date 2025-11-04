import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ElectronicSignatureParam } from '@modules/config/domain/models/electronic-signature.model';
import { ElectronicSignatureRepository } from '@modules/config/domain/repositories/electronic-signature.repository';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateSignatureElectronicSignatureUseCase
  implements BaseUseCase<ApiResponse, Partial<ElectronicSignatureParam>>
{
  private repo = inject(ElectronicSignatureRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<ElectronicSignatureParam>): Observable<ApiResponse> {
    return this.repo.updateSignature(params);
  }
}
