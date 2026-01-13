import { DocConfig } from '../models/doc-config.model';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  DocConfigFormDataResponse,
  DocConfigInfoAdicionalList,
  DocConfigListResponse,
} from '../models/doc-config.model';

export abstract class DocConfigRepository {
  abstract save(docConfig: DocConfig): Observable<ApiResponseLegacy>;
  abstract getFormData(): Observable<DocConfigFormDataResponse>;
  abstract create(params: any): Observable<ApiResponseLegacy>;
  abstract getInfoAdicionales(id: number): Observable<DocConfigInfoAdicionalList[]>;
  abstract list(puntoEmisionId: number): Observable<DocConfigListResponse>;
}
