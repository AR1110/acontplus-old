import { Observable } from 'rxjs';
import { ImportacionResponse } from '@modules/config/data/models/importacion.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class ExcelImportRepository {
  abstract list(): Observable<ImportacionResponse>;
  abstract getFormData(): Observable<ImportacionResponse>;
  abstract validateImportedData(params: any): Observable<ApiResponseLegacy>;
  abstract save(params: any): Observable<ApiResponseLegacy>;
}
