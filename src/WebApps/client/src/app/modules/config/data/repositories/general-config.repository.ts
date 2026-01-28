import { Observable } from 'rxjs';
import { GeneralConfigResponse } from '@modules/config/data/models/general-config.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class GeneralConfigRepository {
  abstract list(parameters: string): Observable<GeneralConfigResponse>;
  abstract update<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract sendMaxUsers(): Observable<ApiResponseLegacy | null>;

  abstract sendMaxDocuments(): Observable<ApiResponseLegacy | null>;
  abstract sendMaxInventoryItems(): Observable<ApiResponseLegacy | null>;

  abstract sendMaxWarehouses(): Observable<ApiResponseLegacy | null>;

  abstract sendMaxEstablishments(): Observable<ApiResponseLegacy | null>;
  abstract sendPolicy(codePolicy: string): Observable<ApiResponseLegacy>;
}
