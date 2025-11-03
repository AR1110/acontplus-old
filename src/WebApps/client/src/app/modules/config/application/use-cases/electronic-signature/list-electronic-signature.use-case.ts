import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ElectronicSignatureListResponse } from '@modules/config/domain/models/electronic-signature.model';
import { ElectronicSignatureRepository } from '@modules/config/domain/repositories/electronic-signature.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListElectronicSignatureUseCase
  implements BaseUseCase<ElectronicSignatureListResponse, any>
{
  private repo = inject(ElectronicSignatureRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(): Observable<ElectronicSignatureListResponse> {
    return this.repo.list();
  }
}
