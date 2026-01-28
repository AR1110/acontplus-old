import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ImportacionResponse } from '@modules/config/data/models/importacion.model';
import { ExcelImportRepository } from '@modules/config/data/repositories/excel-import.repository';

@Injectable({
  providedIn: 'root',
})
export class ListExcelImportUseCase implements BaseUseCase<ImportacionResponse, any> {
  constructor(private repo: ExcelImportRepository) {}

  execute(): Observable<ImportacionResponse> {
    return this.repo.list();
  }
}
