import { DocConfig } from '../models/doc-config.model';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  DocConfigFormDataResponse,
  DocConfigInfoAdicional,
  DocConfigListResponse,
} from '../models/doc-config.model';

export abstract class DocConfigRepository {
  abstract save(docConfig: DocConfig): Observable<ApiResponseLegacy>;
  abstract getFormData(): Observable<DocConfigFormDataResponse>;
  abstract create(params: any): Observable<ApiResponseLegacy>;
  abstract getInfoAdicionales(id: number): Observable<DocConfigInfoAdicional[]>;
  abstract list(puntoEmisionId: number): Observable<DocConfigListResponse>;
}
