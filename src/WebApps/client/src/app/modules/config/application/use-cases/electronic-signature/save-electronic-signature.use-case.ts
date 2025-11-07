import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ElectronicSignatureParam } from '@modules/config/domain/models/electronic-signature.model';
import { Observable } from 'rxjs';
import { ElectronicSignatureRepository } from '@modules/config/domain/repositories/electronic-signature.repository';

@Injectable({
  providedIn: 'root',
})
export class SaveElectronicSignatureUseCase
  implements BaseUseCase<ApiResponseLegacy, ElectronicSignatureParam>
{
  private repo = inject<ElectronicSignatureRepository>(ElectronicSignatureRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(signature: ElectronicSignatureParam): Observable<ApiResponseLegacy> {
    return this.repo.save(signature);
  }
}
