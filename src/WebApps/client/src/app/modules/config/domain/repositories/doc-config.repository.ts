import { DocConfig } from '../models/doc-config.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { DocConfigFormDataResponse, DocConfigInfoAdicional, DocConfigListResponse } from '../models/doc-config.model';

export abstract class DocConfigRepository {
  abstract save(docConfig: DocConfig): Observable<ApiResponse>;
  abstract getFormData(): Observable<DocConfigFormDataResponse>;
  abstract create(params: any): Observable<ApiResponse>;
  abstract getInfoAdicionales(id: number): Observable<DocConfigInfoAdicional[]>;
  abstract list(puntoEmisionId: number): Observable<DocConfigListResponse>;
}
