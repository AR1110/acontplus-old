import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ElectronicSignatureParam } from '@modules/config/domain/models/electronic-signature.model';
import { ElectronicSignatureRepository } from '@modules/config/domain/repositories/electronic-signature.repository';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CreateElectronicSignatureUseCase
  implements BaseUseCase<ApiResponseLegacy, ElectronicSignatureParam>
{
  private repo = inject(ElectronicSignatureRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: ElectronicSignatureParam): Observable<ApiResponseLegacy> {
    return this.repo.create(params);
  }
}
