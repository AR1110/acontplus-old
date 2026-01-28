import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ExcelImportRepository } from '@modules/config/data/repositories/excel-import.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidateImportedDataUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(ExcelImportRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(params: any): Observable<ApiResponseLegacy> {
    return this.repo.validateImportedData(params);
  }
}
