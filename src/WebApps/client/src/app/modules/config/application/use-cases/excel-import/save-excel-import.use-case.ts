import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { ExcelImportRepository } from '@modules/config/domain/repositories/excel-import.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaveExcelImportUseCase implements BaseUseCase<ApiResponse, any> {
  private repo = inject(ExcelImportRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(params: any): Observable<ApiResponse> {
    return this.repo.save(params);
  }
}
