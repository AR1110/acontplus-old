import { Observable } from 'rxjs';
import {ImportacionResponse} from "@modules/config/domain/models/importacion.model";
import {ApiResponse} from "@core/models/api-response";

export abstract class ExcelImportRepository {
  abstract list (): Observable<ImportacionResponse>;
  abstract getFormData (): Observable<ImportacionResponse>;
  abstract validateImportedData(params:any): Observable<ApiResponse>
  abstract save(params:any): Observable<ApiResponse>
}
