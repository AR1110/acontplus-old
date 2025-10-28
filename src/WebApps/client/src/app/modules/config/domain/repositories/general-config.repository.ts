import { Observable } from 'rxjs';
import { GeneralConfigResponse } from '@modules/config/domain/models/general-config.model';
import { ApiResponse } from '@core/models/api-response';

export abstract class GeneralConfigRepository {
  abstract list(parameters: string): Observable<GeneralConfigResponse>;
  abstract update<T>(parameters: T): Observable<ApiResponse>;
  abstract sendMaxUsers(): Observable<ApiResponse | null>;

  abstract sendMaxDocuments(): Observable<ApiResponse | null>;
  abstract sendMaxInventoryItems(): Observable<ApiResponse | null>;

  abstract sendMaxWarehouses(): Observable<ApiResponse | null>;

  abstract sendMaxEstablishments(): Observable<ApiResponse | null>;
  abstract sendPolicy(codePolicy: string): Observable<ApiResponse>;
}
