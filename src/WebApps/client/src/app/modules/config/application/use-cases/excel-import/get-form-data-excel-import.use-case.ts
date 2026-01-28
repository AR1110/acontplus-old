import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ImportacionResponse } from '@modules/config/data/models/importacion.model';
import { ExcelImportRepository } from '@modules/config/data/repositories/excel-import.repository';

@Injectable({
  providedIn: 'root',
})
export class GetFormDataExcelImportUseCase implements BaseUseCase<ImportacionResponse, any> {
  private repo = inject(ExcelImportRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(): Observable<ImportacionResponse> {
    return this.repo.getFormData();
  }
}
