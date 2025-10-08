import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { ExcelImportRepository } from '@modules/config/domain/repositories/excel-import.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaveExcelImportUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo: ExcelImportRepository) {}
  execute(params: any): Observable<ApiResponse> {
    return this.repo.save(params);
  }
}
